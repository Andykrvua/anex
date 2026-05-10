// Pure logic for merging search polling snapshots.
// No React, no zustand — so it can be tested in DevTools.
// Full model — docs/search-ux-redesign/02-store-and-merge.md.

/**
 * @typedef {Object} Offer
 * @property {string} i      offer id
 * @property {number} oi     operator id
 * @property {number} n      total nights (slot)
 * @property {number} nh     hotel nights
 * @property {number} pl     UAH price (for sorting and comparison)
 * @property {number} p      price in operator currency
 * @property {string} d      start ISO
 * @property {string} dt     end ISO
 * @property {string} r      room name
 * @property {string} f      food code
 */

/**
 * @typedef {Object} Hotel
 * API hotels[id] fields (i,n,s,t,c,e,f,g,r,v,rb,...) + computed:
 * @property {Record<number, Offer|null>} offers       offers[7], offers[8], offers[9]
 * @property {Offer[]}                    allOffers    cumulative dedup-by-id, sorted by pl asc
 * @property {Record<number, Offer[]>}    history      offers displaced on price_drop
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
 * @property {number|null} etaSeconds      null until ≥3 completed timings (median)
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
    // true when the cycle was closed by hard-timeout (12 attempts × 5s = 60s).
    // ContinueSearchButton uses this flag to change the hint text:
    // the user should understand that it ended not because "the server said stop",
    // but because "we timed out waiting".
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
 * Single pass over results — builds both indexes:
 *   - cheapestPerSlot: hotelId -> { n: cheapestOffer | null }
 *   - allByHotel:      hotelId -> Offer[] (sorted by pl asc)
 *
 * `allByHotel` is needed by card components (favorites, OpenStreetMap modal,
 * food/transport message) that read the full offer list for a hotel —
 * like `actualOffers` in legacy `cards.js`. Storing separately from slot offers
 * is easier than reconstructing from results later.
 *
 * O(N_offers) instead of O(N_hotels × N_offers).
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
 * Merge cumulative offer list for a hotel by offer.i.
 * `allOffers` is needed by the card for the map, favorites, food-message and for
 * `cheapest = allOffers[0]`. Simply overwriting it with the current
 * `newAllOffers` (as before) means on a continuation-page the server returns
 * a different set of offers — `cheapest`/map/favorites drift to the "last page
 * snapshot", even if `offers[slot]` already holds the best offer from a
 * previous page. So we accumulate cumulatively.
 *
 * Dedupe by offer.i — Map.set overwrites the same id if an updated version
 * arrives (price update). Sorting by pl asc is needed by consumers —
 * `allOffers[0]` is universally treated as cheapest.
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
 * Progress. ETA via MEDIAN of completed operator times
 * (mean is distorted by outliers like Coral 306s while others take 1-10s).
 * etaSeconds = null until ≥3 completed timings have accumulated.
 *
 * totalHotels is NOT taken from here — that is `Σ workProgress[op].hotels` =
 * operator×hotel pairs, not unique hotels. Unique count comes from
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
 * Main merge function.
 *
 * INITIAL BASELINE: the first snapshot that FIRST brings a non-empty
 * set of hotels. Before it (and within it) updates are NOT generated —
 * the user just opened the results, marking every card as "new" is UX noise.
 * Logic controlled by flag `session.baselineEstablished`.
 * `getr1.md` (empty) → flag false → the next getr4.md sets
 * baseline WITHOUT 74 false new_hotel events.
 *
 * Continuation search (run({ continueSearch: true })) does NOT reset
 * the flag — new hotels in continuation correctly produce `new_hotel`.
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

  // baseline is the ENTIRE first result set (page=1 from the first snapshot to lastResult).
  // Previously baseline closed on the very first non-empty snapshot, and already on
  // snapshot #2 of the polling cycle (same page=1) each new operator appearance
  // (Coral/Alf/etc.) produced "+27 new hotels" and "45 updates".
  // The user saw the updates banner before seeing the full result set.
  // Now baseline closes only when the server says lastResult=true
  // on page=1 → the entire first polling cycle is collected without emitting.
  // Continuation (pageNumber>=2) and post-baseline polling — emit normally.
  const baselineJustClosed =
    !session.baselineEstablished && payload.lastResult && session.pageNumber === 1;
  const shouldEmitUpdates = session.baselineEstablished;

  for (const hotelId of apiHotelIds) {
    const apiHotel = payload.hotels[hotelId];
    const newOffers = cheapestPerSlot[hotelId] || emptyOffersForSlots(slots);
    const newAllOffers = allByHotel[hotelId] || [];
    const prevHotel = session.hotelsById[hotelId];

    if (!prevHotel) {
      // NEW HOTEL
      nextHotelsById[hotelId] = {
        ...apiHotel,
        offers: newOffers,
        // dedupe within a single snapshot is also needed — buildOffersIndex
        // does push without dedupe, and one offer.i can arrive from two
        // operatorIds (for a new hotel mergeAllOffers(null, newAll) takes
        // newAll and dedupes via Map).
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

    // EXISTING HOTEL — diff per-slot.
    const mergedOffers = { ...prevHotel.offers };
    const mergedHistory = { ...prevHotel.history };
    let touched = false;

    for (const nights of slots) {
      const oldOffer = prevHotel.offers[nights];
      const newOffer = newOffers[nights];
      if (!newOffer) continue; // not in new snapshot — keep the old one

      if (!oldOffer) {
        // SLOT FILLED — data is always merged (user must see the best offer),
        // but update is emitted only after baseline. Otherwise the baseline
        // polling cycle would produce "Offer found" for every slot of every new
        // operator, which is noise for the user, not an "update".
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
        // PRICE DROP — data (mergedOffers + history) is always merged,
        // emit is gated by baseline flag for the same reason as slot_filled.
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
      // newOffer.pl >= oldOffer.pl — leave it (do NOT show "price went up").
    }

    // Cumulative merge for allOffers — do NOT replace with newAllOffers, otherwise
    // map/favorites/cheapest-link drift to the "last page snapshot"
    // and diverge from what is shown in slots (which hold the best offer).
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

  // slotOffers — actual number of offers the UI will show: for each hotel
  // at most 1 per requested night-slot (n, n+1, n+2),
  // i.e. total in range [hotels, hotels*3]. progress.totalOffers (Σ
  // workProgress[op].offers) is an operator×nights gross counter and does not
  // correspond to the visible list (inflated several times), so we keep both.
  let slotOffersCount = 0;
  for (const h of Object.values(nextHotelsById)) {
    if (!h || !h.offers) continue;
    for (const o of Object.values(h.offers)) {
      if (o) slotOffersCount++;
    }
  }

  const batches = [
    ...session.batches,
    {
      snapshotVersion: nextVersion,
      receivedAt: Date.now(),
      counts: {
        hotels: Object.keys(nextHotelsById).length,
        offers: progress.totalOffers,
        slotOffers: slotOffersCount,
      },
    },
  ];

  // hasMoreServerPages — disable conservatively. One "unhelpful"
  // continuation page does NOT mean there is nothing further.
  // Triggers for false (any of):
  //   A. lastResult+page=1 with empty accumulated list — server immediately
  //      said "nothing found for these params", continuation is pointless.
  //   B. lastResult continuation with genuinely empty payload.hotels.
  //   C. UNHELPFUL_CONTINUATION_LIMIT consecutive "unhelpful" cycles.
  let nextHasMore = session.hasMoreServerPages;
  let nextUnhelpful = session.unhelpfulContinuationCount;
  if (payload.lastResult) {
    const accumulatedEmpty = Object.keys(nextHotelsById).length === 0;
    if (session.pageNumber === 1 && accumulatedEmpty) {
      // Trigger A — "nothing found for this query". Without this the user
      // would see the "Continue search" button alongside "0 tours found".
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
// Selectors
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
 * Single entry point for ordering + filtering.
 * All other page/index selectors are built ON TOP of this one —
 * so that `selectHotelsForPage` and `selectHotelPageIndex` stay in sync
 * (otherwise jump-to from the updates panel would land on the wrong page).
 *
 * `frozenUpdatedOnlyIds` (if passed and filters.updatedOnly=true) — snapshot
 * of hotel ids at the moment the checkbox was turned on. Without it the filter
 * self-emptied: observer markViewed cleared unviewed-updates →
 * `selectHotelHasUnviewedUpdate` returned false → card dropped from the set.
 * The frozen set is stable until the user unchecks the checkbox.
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
 * All unviewed updates for a single hotel. Used by CardBadge (dominant
 * type) and OfferSlot (per-slot price_drop/slot_filled indicator).
 */
export function selectHotelUnviewedUpdates(session, hotelId) {
  const target = String(hotelId);
  return session.updates.filter(
    (u) => u.hotelId === target && !session.viewedUpdateIds.has(u.id),
  );
}
