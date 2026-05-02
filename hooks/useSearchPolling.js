import { useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import {
  useGetUp,
  useGetDown,
  useGetDate,
  useGetNight,
  useGetPerson,
  useGetToCities,
  useGetInitialDate,
} from 'store/store';
import {
  useSearchStore,
  useStartNewSearch,
  useIngestSnapshot,
  useSetSearchStatus,
  useFinishCycleByTimeout,
  useRequestNextServerPage,
} from 'store/searchStore';
import { stringifyCrewComposition } from 'utils/customer-crew';
import { buildDateSearchQuery } from 'utils/dateRange';

const ACCESS_TOKEN = '337da-65e22-26745-a251f-77b9e';
const ENDPOINT = 'https://api.otpusk.com/api/2.6/tours/getResults';
const POLL_INTERVAL_MS = 5000;
const MAX_POLL_ATTEMPTS = 12;

// sleep с поддержкой AbortSignal — иначе старый цикл будет висеть в setTimeout
// 5 секунд после применения фильтра / continueSearch и потом всё равно вернётся.
const sleep = (ms, signal) =>
  new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      reject(new DOMException('Aborted', 'AbortError'));
      return;
    }
    const t = setTimeout(resolve, ms);
    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(t);
        reject(new DOMException('Aborted', 'AbortError'));
      });
    }
  });

const isAbort = (e) => e && (e.name === 'AbortError' || e.code === 20);

function readUrlFilters() {
  if (typeof window === 'undefined') return {};
  const url = new URL(window.location.href);
  return {
    price: url.searchParams.get('price') ?? '',
    priceTo: url.searchParams.get('priceTo') ?? '',
    stars: url.searchParams.get('stars') ?? '',
    food: url.searchParams.get('food') ?? '',
    services: url.searchParams.get('services') ?? '',
  };
}

function buildUrl(params, page, number) {
  const { up, down, date, night, person, toCities, initialDate, loc } = params;
  const people = stringifyCrewComposition(person);
  const { checkIn, checkTo } = buildDateSearchQuery(date, initialDate);
  const transport = up.transport ? up.transport : 'no';
  const filters = readUrlFilters();

  let url =
    `${ENDPOINT}?page=${page}&number=${number}&lang=${loc}` +
    `&transport=${transport}&from=${up.value}&to=${down.value}` +
    `&checkIn=${checkIn}&checkTo=${checkTo}` +
    `&nights=${night.from}&nightsTo=${night.to}` +
    `&people=${people}&access_token=${ACCESS_TOKEN}`;

  if (toCities && toCities.length > 0) {
    url += `&toCities=${toCities.join(',')}`;
  }
  url += `&price=${filters.price}`;
  url += `&priceTo=${filters.priceTo}`;
  url += `&stars=${filters.stars}`;
  url += `&food=${filters.food}`;
  url += `&services=${filters.services}`;
  url += `&sort=price`; // placeholder из API-доки, фактически не работает

  return url;
}

async function fetchGetResults(params, page, number, signal) {
  const url = buildUrl(params, page, number);
  const res = await fetch(url, { signal });
  if (res.status !== 200) return null;
  return res.json();
}

/**
 * Единая точка входа в polling-поиск.
 * - Берёт параметры из store/store.js (legacy form state).
 * - Конвертит locale 'uk' → 'ua' (legacy convention для otpusk API).
 * - slots всегда `[from, from+1, from+2]` — форма выбирает блок длительности целиком.
 * - URL: page (server page) + number (poll attempt counter, сбрасывается на 0
 *   в начале каждого цикла).
 * - На каждый ответ — `ingestSnapshot` в searchStore.
 * - Continuation search не сбрасывает session, инкрементит pageNumber.
 *
 * См. docs/search-ux-redesign/04-phases.md, Фаза 2.
 */
export default function useSearchPolling() {
  const router = useRouter();

  const up = useGetUp();
  const down = useGetDown();
  const date = useGetDate();
  const night = useGetNight();
  const person = useGetPerson();
  const toCities = useGetToCities();
  const initialDate = useGetInitialDate();

  const startNewSearch = useStartNewSearch();
  const ingestSnapshot = useIngestSnapshot();
  const setStatus = useSetSearchStatus();
  const finishByTimeout = useFinishCycleByTimeout();
  const requestNextServerPage = useRequestNextServerPage();

  // Защита от race-condition. Каждый вызов run() инкрементит runIdRef и
  // абортит in-flight fetch/sleep предыдущего цикла. После каждого await
  // сравниваем myRunId с runIdRef.current — если не совпадает, мы устарели
  // (юзер применил фильтр / нажал "Продолжить") и НЕ должны писать в store.
  const runIdRef = useRef(0);
  const abortRef = useRef(null);

  // Unmount cleanup. Без него юзер уходит со страницы во время polling —
  // setTimeout/fetch продолжают жить, через 5s loop делает ingestSnapshot
  // в Zustand store, состояние "висит" между сессиями. abort() будит
  // sleep() и обрывает fetch → AbortError → return до записи в store.
  useEffect(
    () => () => {
      if (abortRef.current) abortRef.current.abort();
      // Бамп runId на всякий случай — если что-то проскочило между
      // abort и unmount, isStale() вернёт true и заблокирует запись.
      runIdRef.current += 1;
    },
    [],
  );

  const run = useCallback(
    async ({ continueSearch = false } = {}) => {
      // Cancel any in-flight previous cycle.
      if (abortRef.current) abortRef.current.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      const myRunId = ++runIdRef.current;
      const isStale = () => myRunId !== runIdRef.current;

      const slots = [night.from, night.from + 1, night.from + 2];
      const loc = router.locale === 'uk' ? 'ua' : 'ru';

      // Считаем nextPage синхронно ДО обновления store. Локальный nextPage
      // стабилен на протяжении одного run() — никаких race с Zustand-set.
      const nextPage = continueSearch
        ? useSearchStore.getState().session.pageNumber + 1
        : 1;

      const params = { up, down, date, night, person, toCities, initialDate, loc };

      if (continueSearch) {
        requestNextServerPage();
      } else {
        startNewSearch(params);
      }

      let attempt = 0;
      while (true) {
        let data;
        try {
          data = await fetchGetResults(params, nextPage, attempt, ctrl.signal);
        } catch (e) {
          if (isAbort(e) || isStale()) return;
          // eslint-disable-next-line no-console
          console.error('[useSearchPolling] fetch failed', e);
          setStatus('error');
          return;
        }
        if (isStale()) return;
        if (!data) {
          setStatus('error');
          return;
        }
        ingestSnapshot(data, slots);
        if (data.lastResult) break;

        if (attempt > MAX_POLL_ATTEMPTS) {
          // hard timeout — последний ingest не имел lastResult, поэтому
          // applySnapshot оставил isLastResult=false. ContinueSearchButton
          // в этом состоянии не рендерится → юзер в тупике.
          // finishByTimeout ставит status='done' + isLastResult=true +
          // timedOut=true одной транзакцией.
          finishByTimeout();
          break;
        }
        attempt += 1;
        try {
          await sleep(POLL_INTERVAL_MS, ctrl.signal);
        } catch (e) {
          if (isAbort(e)) return;
          throw e;
        }
        if (isStale()) return;
      }
    },
    [
      router.locale,
      up,
      down,
      date,
      night,
      person,
      toCities,
      initialDate,
      startNewSearch,
      ingestSnapshot,
      setStatus,
      finishByTimeout,
      requestNextServerPage,
    ],
  );

  return { run };
}
