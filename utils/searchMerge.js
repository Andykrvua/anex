// Чистая логика merge polling-snapshot-ов поиска.
// Без React, без zustand — чтобы можно было тестировать в DevTools.
// Полная модель — docs/search-ux-redesign/02-store-and-merge.md.

/**
 * @typedef {Object} Offer
 * @property {string} i      offer id
 * @property {number} oi     operator id
 * @property {number} n      total nights (slot)
 * @property {number} nh     hotel nights
 * @property {number} pl     UAH price (для сортировки и сравнения)
 * @property {number} p      price in operator currency
 * @property {string} d      start ISO
 * @property {string} dt     end ISO
 * @property {string} r      room name
 * @property {string} f      food code
 */

/**
 * @typedef {Object} Hotel
 * Поля API hotels[id] (i,n,s,t,c,e,f,g,r,v,rb,...) + computed:
 * @property {Record<number, Offer|null>} offers       offers[7], offers[8], offers[9]
 * @property {Offer[]}                    allOffers    cumulative dedup-by-id, sorted by pl asc
 * @property {Record<number, Offer[]>}    history      вытесненные оферы при price_drop
 * @property {number}                     firstSeenSnapshot
 * @property {number|null}                lastUpdatedSnapshot
 */

/**
 * @typedef {Object} Update
 * @property {string} id                 `${snapshotV}:${hotelId}:${type}:${nights ?? '_'}`
 * @property {number} snapshotVersion
 * @property {string} hotelId
 * @property {'new_hotel'|'price_drop'|'slot_filled'} type
 * @property {number} [nights]
 * @property {{pl:number, offerI:string}} [before]
 * @property {{pl:number, offerI:string}} [after]
 * @property {number} createdAt
 */

/**
 * @typedef {Object} Progress
 * @property {number}    operatorsDone
 * @property {number}    operatorsTotal
 * @property {string[]}  operatorsRunning
 * @property {number|null} etaSeconds      null до ≥3 завершённых таймингов (median)
 * @property {number}    totalOffers       Σ workProgress[op].offers
 */

/**
 * @typedef {Object} SearchSession
 * @property {string}                              sessionId
 * @property {*}                                   params
 * @property {'idle'|'searching'|'done'|'error'}   status
 * @property {Record<string, Hotel>}               hotelsById
 * @property {string[]}                            order
 * @property {number}                              snapshotVersion
 * @property {boolean}                             baselineEstablished
 * @property {boolean}                             isLastResult
 * @property {Progress|null}                       progress
 * @property {number}                              pageNumber
 * @property {{hotelsCount:number, updatesCount:number}|null} continuationMark
 * @property {number}                              unhelpfulContinuationCount
 * @property {boolean}                             hasMoreServerPages
 * @property {Update[]}                            updates
 * @property {Set<string>}                         viewedUpdateIds
 * @property {{snapshotVersion:number, receivedAt:number, counts:{hotels:number, offers:number}}[]} batches
 */

const UNHELPFUL_CONTINUATION_LIMIT = 3;
const ETA_MIN_COMPLETED = 3;

function cryptoRandomId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 9)}`;
}

/** @returns {SearchSession} */
export function createEmptySession(params = null) {
  return {
    sessionId: cryptoRandomId(),
    params,
    status: 'idle',
    hotelsById: {},
    order: [],
    snapshotVersion: 0,
    baselineEstablished: false,
    isLastResult: false,
    // true когда цикл закрыли по hard-timeout (12 attempts × 5s = 60s).
    // ContinueSearchButton использует этот флаг чтобы поменять hint-текст:
    // юзер должен понимать, что закончилось не "сервер сказал стоп",
    // а "мы устали ждать".
    timedOut: false,
    progress: null,
    pageNumber: 1,
    continuationMark: null,
    unhelpfulContinuationCount: 0,
    hasMoreServerPages: true,
    updates: [],
    viewedUpdateIds: new Set(),
    batches: [],
  };
}

/** @returns {SearchSession} */
export function resetSession({ params } = {}) {
  return { ...createEmptySession(params), status: 'searching' };
}

function emptyOffersForSlots(slots) {
  const out = {};
  for (const n of slots) out[n] = null;
  return out;
}

function emptyHistory(slots) {
  const out = {};
  for (const n of slots) out[n] = [];
  return out;
}

/**
 * Один проход по results — строим оба индекса:
 *   - cheapestPerSlot: hotelId -> { n: cheapestOffer | null }
 *   - allByHotel:      hotelId -> Offer[] (отсортированы по pl asc)
 *
 * `allByHotel` нужен компонентам карточки (favorites, OpenStreetMap modal,
 * food/transport message), которые читают полный список оферов отеля —
 * как `actualOffers` в legacy `cards.js`. Хранить отдельно от слот-офферов
 * легче, чем потом восстанавливать из results.
 *
 * O(N_offers) вместо O(N_hotels × N_offers).
 */
export function buildOffersIndex(results, slots) {
  /** @type {Record<string, Record<number, Offer|null>>} */
  const cheapestPerSlot = {};
  /** @type {Record<string, Offer[]>} */
  const allByHotel = {};
  if (!results) return { cheapestPerSlot, allByHotel };
  const slotSet = new Set(slots);

  for (const opId of Object.keys(results)) {
    const byHotel = results[opId];
    if (!byHotel) continue;
    for (const hotelId of Object.keys(byHotel)) {
      const offers = byHotel[hotelId] && byHotel[hotelId].offers;
      if (!offers) continue;
      let allBucket = allByHotel[hotelId];
      if (!allBucket) {
        allBucket = [];
        allByHotel[hotelId] = allBucket;
      }
      let slotBucket = cheapestPerSlot[hotelId];
      if (!slotBucket) {
        slotBucket = emptyOffersForSlots(slots);
        cheapestPerSlot[hotelId] = slotBucket;
      }
      for (const offerId of Object.keys(offers)) {
        const o = offers[offerId];
        allBucket.push(o);
        if (!slotSet.has(o.n)) continue;
        const cur = slotBucket[o.n];
        if (!cur || o.pl < cur.pl) slotBucket[o.n] = o;
      }
    }
  }
  for (const hotelId of Object.keys(allByHotel)) {
    allByHotel[hotelId].sort((a, b) => a.pl - b.pl);
  }
  return { cheapestPerSlot, allByHotel };
}

/**
 * Merge кумулятивного списка оферов готелю по offer.i.
 * `allOffers` нужен карточке для карты, favorites, food-message и для
 * `cheapest = allOffers[0]`. Если просто перезаписывать его текущим
 * `newAllOffers` (как было раньше), на continuation-page server вернёт
 * другой набор оферов — `cheapest`/карта/favorites уезжают в "снимок
 * последней страницы", даже если в `offers[slot]` уже сохранён лучший
 * офер с прошлой страницы. Поэтому копим cumulative.
 *
 * Dedupe by offer.i — Map.set перезапишет тот же id, если пришла обновлённая
 * версия (price update). Сортировка по pl asc нужна потребителям —
 * `allOffers[0]` повсеместно трактуется как cheapest.
 */
function mergeAllOffers(prevAll, newAll) {
  const map = new Map();
  if (prevAll) for (const o of prevAll) map.set(o.i, o);
  if (newAll) for (const o of newAll) map.set(o.i, o);
  if (map.size === 0) return [];
  const arr = Array.from(map.values());
  arr.sort((a, b) => a.pl - b.pl);
  return arr;
}

/**
 * Прогресс. ETA через МЕДИАНУ времени завершённых операторов
 * (среднее портится выбросами типа Coral 306с при остальных по 1-10с).
 * etaSeconds = null до накопления ≥3 завершённых таймингов.
 *
 * totalHotels НЕ берём отсюда — это `Σ workProgress[op].hotels` =
 * operator×hotel пары, не уникальные отели. Уникальные — из
 * `Object.keys(session.hotelsById).length`.
 *
 * @returns {Progress}
 */
export function computeProgress(workProgress) {
  const ops = Object.values(workProgress || {});
  const total = ops.length;
  const done = ops.filter((o) => o.status === 'done').length;
  const running = ops.filter((o) => o.status === 'run');

  const completedTimes = ops
    .filter((o) => o.status === 'done' && typeof o.time === 'number')
    .map((o) => o.time)
    .sort((a, b) => a - b);

  const medianTime = completedTimes.length >= ETA_MIN_COMPLETED
    ? completedTimes[Math.floor(completedTimes.length / 2)]
    : null;

  return {
    operatorsDone: done,
    operatorsTotal: total,
    operatorsRunning: running.map((o) => o.operator),
    etaSeconds: medianTime != null
      ? Math.max(1, Math.ceil(running.length * medianTime))
      : null,
    totalOffers: ops.reduce((s, o) => s + (o.offers || 0), 0),
  };
}

/**
 * Главная функция merge.
 *
 * INITIAL BASELINE: первый snapshot, который ВПЕРВЫЕ принёс непустой
 * набор отелей. До него (и в его рамках) updates НЕ генерируются —
 * пользователь только что открыл выдачу, помечать каждую карточку
 * "новой" — UX-шум. Логика — флаг `session.baselineEstablished`.
 * `getr1.md` (пустой) → флаг false → следующий getr4.md установит
 * baseline БЕЗ 74 ложных new_hotel.
 *
 * Continuation search (run({ continueSearch: true })) НЕ сбрасывает
 * флаг — новые отели в продолжении корректно дают `new_hotel`.
 *
 * @param {SearchSession} session
 * @param {Object}        payload
 * @param {number[]}      slots
 * @returns {SearchSession}
 */
export function applySnapshot(session, payload, slots) {
  const nextVersion = session.snapshotVersion + 1;

  const { cheapestPerSlot, allByHotel } = buildOffersIndex(payload.results, slots);

  const nextHotelsById = { ...session.hotelsById };
  const nextOrder = [...session.order];
  const nextUpdates = [...session.updates];

  const apiHotelIds = Object.keys(payload.hotels || {});

  // baseline — это ВСЯ первая выдача (page=1 от первого snapshot до lastResult).
  // Раньше baseline закрывался на первом же непустом snapshot, и уже на
  // snapshot #2 polling-цикла (того же page=1) каждое появление нового
  // оператора (Coral/Alf/etc.) выдавало "+27 новых отелей" и "45 обновлений".
  // Юзер видел banner про updates, не успев увидеть полную выдачу.
  // Теперь baseline закрывается только когда сервер сказал lastResult=true
  // на page=1 → весь первый цикл polling собирается без emitов.
  // Continuation (pageNumber>=2) и пост-baseline polling — emit нормально.
  const baselineJustClosed =
    !session.baselineEstablished && payload.lastResult && session.pageNumber === 1;
  const shouldEmitUpdates = session.baselineEstablished;

  for (const hotelId of apiHotelIds) {
    const apiHotel = payload.hotels[hotelId];
    const newOffers = cheapestPerSlot[hotelId] || emptyOffersForSlots(slots);
    const newAllOffers = allByHotel[hotelId] || [];
    const prevHotel = session.hotelsById[hotelId];

    if (!prevHotel) {
      // НОВЫЙ ОТЕЛЬ
      nextHotelsById[hotelId] = {
        ...apiHotel,
        offers: newOffers,
        // dedupe внутри одного snapshot тоже нужен — buildOffersIndex
        // делает push без dedupe, и один offer.i может прийти от двух
        // operatorId (для нового отеля mergeAllOffers(null, newAll) берёт
        // newAll и dedup-ит по Map).
        allOffers: mergeAllOffers(null, newAllOffers),
        history: emptyHistory(slots),
        firstSeenSnapshot: nextVersion,
        lastUpdatedSnapshot: nextVersion,
      };
      nextOrder.push(String(hotelId));
      if (shouldEmitUpdates) {
        nextUpdates.push({
          id: `${nextVersion}:${hotelId}:new_hotel:_`,
          snapshotVersion: nextVersion,
          hotelId: String(hotelId),
          type: 'new_hotel',
          createdAt: Date.now(),
        });
      }
      continue;
    }

    // СУЩЕСТВУЮЩИЙ ОТЕЛЬ — diff per-slot.
    const mergedOffers = { ...prevHotel.offers };
    const mergedHistory = { ...prevHotel.history };
    let touched = false;

    for (const nights of slots) {
      const oldOffer = prevHotel.offers[nights];
      const newOffer = newOffers[nights];
      if (!newOffer) continue; // в новом snapshot нет — оставляем старый

      if (!oldOffer) {
        // SLOT FILLED — данные мерджим всегда (юзер должен видеть лучший офер),
        // но update emit-им только после baseline. Иначе baseline-цикл
        // polling-а выдаст "Найден офер" по каждому слоту каждого нового
        // оператора, что для юзера — шум, а не "обновление".
        mergedOffers[nights] = newOffer;
        touched = true;
        if (shouldEmitUpdates) {
          nextUpdates.push({
            id: `${nextVersion}:${hotelId}:slot_filled:${nights}`,
            snapshotVersion: nextVersion,
            hotelId: String(hotelId),
            type: 'slot_filled',
            nights,
            after: { pl: newOffer.pl, offerI: newOffer.i },
            createdAt: Date.now(),
          });
        }
      } else if (newOffer.pl < oldOffer.pl) {
        // PRICE DROP — данные (mergedOffers + history) мерджим всегда,
        // emit gate-им baseline-флагом по той же причине что и slot_filled.
        mergedOffers[nights] = newOffer;
        mergedHistory[nights] = [
          ...(mergedHistory[nights] || []),
          { offer: oldOffer, snapshotVersion: nextVersion },
        ];
        touched = true;
        if (shouldEmitUpdates) {
          nextUpdates.push({
            id: `${nextVersion}:${hotelId}:price_drop:${nights}`,
            snapshotVersion: nextVersion,
            hotelId: String(hotelId),
            type: 'price_drop',
            nights,
            before: { pl: oldOffer.pl, offerI: oldOffer.i },
            after: { pl: newOffer.pl, offerI: newOffer.i },
            createdAt: Date.now(),
          });
        }
      }
      // newOffer.pl >= oldOffer.pl — не трогаем (НЕ показываем "цена выросла").
    }

    // Cumulative merge для allOffers — НЕ заменяем на newAllOffers, иначе
    // карта/favorites/cheapest-link уезжают в "снимок последней страницы"
    // и расходятся с тем, что показано в слотах (которые держат лучший офер).
    const mergedAllOffers = mergeAllOffers(prevHotel.allOffers, newAllOffers);

    if (touched) {
      nextHotelsById[hotelId] = {
        ...prevHotel,
        ...apiHotel,
        offers: mergedOffers,
        allOffers: mergedAllOffers,
        history: mergedHistory,
        firstSeenSnapshot: prevHotel.firstSeenSnapshot,
        lastUpdatedSnapshot: nextVersion,
      };
    } else {
      nextHotelsById[hotelId] = {
        ...prevHotel,
        ...apiHotel,
        offers: prevHotel.offers,
        allOffers: mergedAllOffers,
        history: prevHotel.history,
        firstSeenSnapshot: prevHotel.firstSeenSnapshot,
        lastUpdatedSnapshot: prevHotel.lastUpdatedSnapshot,
      };
    }
  }

  const progress = computeProgress(payload.workProgress || {});

  // batch для отладки. hotels — из обновлённого hotelsById,
  // offers — из progress.totalOffers (не из payload.total — там
  // operator×hotel пары).
  const batches = [
    ...session.batches,
    {
      snapshotVersion: nextVersion,
      receivedAt: Date.now(),
      counts: {
        hotels: Object.keys(nextHotelsById).length,
        offers: progress.totalOffers,
      },
    },
  ];

  // hasMoreServerPages — выключаем консервативно. Одна "бесполезная"
  // continuation-страница НЕ означает, что дальше тоже ничего нет.
  // Триггеры false (любой из):
  //   A. lastResult+page=1 с пустым accumulated списком — сервер сразу
  //      сказал "ничего нет по этим параметрам", continuation бессмысленна.
  //   B. lastResult continuation с РЕАЛЬНО пустым payload.hotels.
  //   C. UNHELPFUL_CONTINUATION_LIMIT подряд "бесполезных" циклов.
  let nextHasMore = session.hasMoreServerPages;
  let nextUnhelpful = session.unhelpfulContinuationCount;
  if (payload.lastResult) {
    const accumulatedEmpty = Object.keys(nextHotelsById).length === 0;
    if (session.pageNumber === 1 && accumulatedEmpty) {
      // Триггер A — "по запросу ничего не найдено". Без этого пользователь
      // видел бы кнопку "Продолжить поиск" вместе с текстом "0 туров найдено".
      nextHasMore = false;
    } else if (session.pageNumber > 1 && session.continuationMark) {
      const grewHotels =
        Object.keys(nextHotelsById).length > session.continuationMark.hotelsCount;
      const grewUpdates =
        nextUpdates.length > session.continuationMark.updatesCount;
      const wasUseful = grewHotels || grewUpdates;

      nextUnhelpful = wasUseful ? 0 : session.unhelpfulContinuationCount + 1;

      const serverSaidEmpty = apiHotelIds.length === 0;
      if (serverSaidEmpty || nextUnhelpful >= UNHELPFUL_CONTINUATION_LIMIT) {
        nextHasMore = false;
      }
    }
  }

  return {
    ...session,
    hotelsById: nextHotelsById,
    order: nextOrder,
    updates: nextUpdates,
    progress,
    snapshotVersion: nextVersion,
    baselineEstablished: session.baselineEstablished || baselineJustClosed,
    isLastResult: !!payload.lastResult,
    hasMoreServerPages: nextHasMore,
    unhelpfulContinuationCount: nextUnhelpful,
    status: payload.lastResult ? 'done' : 'searching',
    batches,
  };
}

// ---------------------------------------------------------------------
// Селекторы
// ---------------------------------------------------------------------

const PAGE_SIZE = 20;

function cheapestPrice(hotel) {
  if (!hotel) return Infinity;
  const prices = Object.values(hotel.offers)
    .filter(Boolean)
    .map((o) => o.pl);
  return prices.length ? Math.min(...prices) : Infinity;
}

function ratingValue(hotel) {
  if (!hotel) return -Infinity;
  const r = parseFloat(hotel.r);
  return Number.isFinite(r) ? r : -Infinity;
}

/**
 * Единая точка входа для упорядочивания + фильтрации.
 * Все остальные page/index-селекторы строятся ПОВЕРХ неё —
 * чтобы `selectHotelsForPage` и `selectHotelPageIndex` не разъезжались
 * (иначе jump-to из панели обновлений попадал бы не на ту страницу).
 *
 * `frozenUpdatedOnlyIds` (если передан и filters.updatedOnly=true) — snapshot
 * id-шников на момент включения чекбокса. Без него фильтр самопустошался:
 * observer markViewed снимал unviewed-updates → `selectHotelHasUnviewedUpdate`
 * возвращал false → карточка вылетала из выборки. Frozen-набор стабилен,
 * пока юзер сам не снимет чекбокс.
 *
 * @param {SearchSession} session
 * @param {{fullOnly?:boolean, updatedOnly?:boolean}} [filters]
 * @param {'stable'|'price_asc'|'price_desc'|'rating_desc'} [sortMode]
 * @param {string[]|null} [frozenUpdatedOnlyIds]
 * @returns {string[]}
 */
export function selectOrderedHotelIds(
  session,
  filters = {},
  sortMode = 'stable',
  frozenUpdatedOnlyIds = null,
) {
  let ids = session.order;

  if (filters.fullOnly || filters.updatedOnly) {
    const frozenSet =
      filters.updatedOnly && frozenUpdatedOnlyIds
        ? new Set(frozenUpdatedOnlyIds)
        : null;
    ids = ids.filter((id) => {
      const hotel = session.hotelsById[id];
      if (!hotel) return false;
      if (filters.fullOnly && !Object.values(hotel.offers).every(Boolean)) {
        return false;
      }
      if (filters.updatedOnly) {
        if (frozenSet) {
          if (!frozenSet.has(id)) return false;
        } else if (!selectHotelHasUnviewedUpdate(session, id)) {
          return false;
        }
      }
      return true;
    });
  }

  if (sortMode === 'stable') return ids;

  const arr = [...ids];
  switch (sortMode) {
    case 'price_asc':
      return arr.sort(
        (a, b) =>
          cheapestPrice(session.hotelsById[a]) -
          cheapestPrice(session.hotelsById[b]),
      );
    case 'price_desc':
      return arr.sort(
        (a, b) =>
          cheapestPrice(session.hotelsById[b]) -
          cheapestPrice(session.hotelsById[a]),
      );
    case 'rating_desc':
      return arr.sort(
        (a, b) =>
          ratingValue(session.hotelsById[b]) -
          ratingValue(session.hotelsById[a]),
      );
    default:
      return arr;
  }
}

export function selectHotelsForPage(
  session,
  page,
  pageSize = PAGE_SIZE,
  filters = {},
  sortMode = 'stable',
  frozenUpdatedOnlyIds = null,
) {
  const ids = selectOrderedHotelIds(session, filters, sortMode, frozenUpdatedOnlyIds);
  const start = (page - 1) * pageSize;
  return ids.slice(start, start + pageSize).map((id) => session.hotelsById[id]);
}

export function selectHotelPageIndex(
  session,
  hotelId,
  pageSize = PAGE_SIZE,
  filters = {},
  sortMode = 'stable',
  frozenUpdatedOnlyIds = null,
) {
  const ids = selectOrderedHotelIds(session, filters, sortMode, frozenUpdatedOnlyIds);
  const idx = ids.indexOf(String(hotelId));
  if (idx < 0) return null;
  return Math.floor(idx / pageSize) + 1; // 1-based
}

export function selectUnviewedCount(session) {
  return session.updates.filter((u) => !session.viewedUpdateIds.has(u.id)).length;
}

export function selectGroupedUpdates(session) {
  /** @type {{new_hotel:Update[], price_drop:Update[], slot_filled:Update[]}} */
  const out = { new_hotel: [], price_drop: [], slot_filled: [] };
  for (const u of session.updates) {
    if (session.viewedUpdateIds.has(u.id)) continue;
    out[u.type].push(u);
  }
  for (const k of Object.keys(out)) {
    out[k].sort(
      (a, b) =>
        b.snapshotVersion - a.snapshotVersion || b.createdAt - a.createdAt,
    );
  }
  return out;
}

export function selectHotelHasUnviewedUpdate(session, hotelId) {
  const target = String(hotelId);
  return session.updates.some(
    (u) => u.hotelId === target && !session.viewedUpdateIds.has(u.id),
  );
}

/**
 * Все unviewed updates одного отеля. Используется CardBadge (доминирующий
 * тип) и OfferSlot (per-slot price_drop/slot_filled индикатор).
 */
export function selectHotelUnviewedUpdates(session, hotelId) {
  const target = String(hotelId);
  return session.updates.filter(
    (u) => u.hotelId === target && !session.viewedUpdateIds.has(u.id),
  );
}
