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

// sleep with AbortSignal support — otherwise the old cycle would hang in setTimeout
// for 5 seconds after applying a filter / continueSearch and then resume anyway.
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
  url += `&sort=price`; // placeholder from API docs, does not actually work

  return url;
}

async function fetchGetResults(params, page, number, signal) {
  const url = buildUrl(params, page, number);
  const res = await fetch(url, { signal });
  if (res.status !== 200) return null;
  return res.json();
}

/**
 * Single entry point for polling search.
 * - Takes parameters from store/store.js (legacy form state).
 * - Converts locale 'uk' → 'ua' (legacy convention for the otpusk API).
 * - slots are always `[from, from+1, from+2]` — the form selects a duration block as a whole.
 * - URL: page (server page) + number (poll attempt counter, reset to 0
 *   at the start of each cycle).
 * - On each response — `ingestSnapshot` into searchStore.
 * - Continuation search does not reset the session, increments pageNumber.
 *
 * See docs/search-ux-redesign/04-phases.md, Phase 2.
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

  // Race-condition guard. Each run() call increments runIdRef and
  // aborts the in-flight fetch/sleep of the previous cycle. After each await
  // we compare myRunId with runIdRef.current — if they differ we are stale
  // (user applied a filter / pressed "Continue") and MUST NOT write to store.
  const runIdRef = useRef(0);
  const abortRef = useRef(null);

  // Unmount cleanup. Without it the user navigates away during polling —
  // setTimeout/fetch keep running, after 5s the loop calls ingestSnapshot
  // in the Zustand store, and state "lingers" between sessions. abort() wakes
  // sleep() and cancels fetch → AbortError → return before writing to store.
  useEffect(
    () => () => {
      if (abortRef.current) abortRef.current.abort();
      // Bump runId as a safety measure — if something slipped through between
      // abort and unmount, isStale() returns true and blocks the write.
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

      // Compute nextPage synchronously BEFORE updating the store. Local nextPage
      // is stable throughout one run() call — no race with Zustand-set.
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
          // hard timeout — the last ingest had no lastResult, so
          // applySnapshot left isLastResult=false. ContinueSearchButton
          // does not render in this state → user is stuck.
          // finishByTimeout sets status='done' + isLastResult=true +
          // timedOut=true in one transaction.
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
