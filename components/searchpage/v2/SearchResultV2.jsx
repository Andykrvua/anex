import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import {
  useGetUp,
  useGetDown,
  useGetDate,
  useGetNight,
  useGetPerson,
  useGetStartSearch,
  useSetStartSearch,
  useGetApplyFilter,
  useSetApplyFilter,
  useSetDown,
  useSetUp,
  useSetNight,
  useSetDate,
  useSetPerson,
  useSetToCities,
  useSetToCitiesNames,
  useGetInitialDate,
} from 'store/store';
import {
  selectHotelPageIndex,
  selectOrderedHotelIds,
} from 'utils/searchMerge';
import useUrlFilters from 'hooks/useUrlFilters';
import {
  useSearchSession,
  useSearchStatus,
  useSearchProgress,
  useHotelsForPage,
  useSortMode,
  useFrozenUpdatedOnlyIds,
  useUnviewedUpdatesCount,
  useFreezeUpdatedOnly,
  useUnfreezeUpdatedOnly,
} from 'store/searchStore';
import useSearchPolling from 'hooks/useSearchPolling';
import { stringifyCrewComposition } from 'utils/customer-crew';
import { buildDateSearchQuery } from 'utils/dateRange';
import { normalizeDateValue } from 'utils/dateRange';
import parseUrl from '../pasteUrl/pasteUrl';
import Loader from 'components/common/loader';
import Pagination from 'components/common/pagination/pagination';
import SearchProgress from './progress/SearchProgress';
import ContinueSearchButton from './progress/ContinueSearchButton';
import UpdatesBanner from './banner/UpdatesBanner';
import UpdatesDrawer from './panel/UpdatesDrawer';
import SortToggle from './controls/SortToggle';
import QualityFilters from './controls/QualityFilters';
import HotelList from './list/HotelList';
import DebugPanel from './dev/DebugPanel';
import styles from './SearchResultV2.module.css';

const PAGE_SIZE = 20;
const ACCESS_TOKEN = '337da-65e22-26745-a251f-77b9e';

/**
 * v2 mount point. Phase 3 — list + pagination added.
 *
 * Search triggers copied from legacy <SearchResult />:
 *  - mount + startSearch=true → run() immediately.
 *  - mount + startSearch=false → parseUrl, populate store, run().
 *  - applyFilter=true → run() (new cycle).
 *  - "Continue" → run({ continueSearch: true }).
 */
export default function SearchResultV2({ isFilterBtnShow = false }) {
  const router = useRouter();
  const intl = useIntl();
  const loc = router.locale === 'uk' ? 'ua' : 'ru';
  const apiLoc = router.locale === 'uk' ? 'ua' : 'ru';
  const status = useSearchStatus();
  const session = useSearchSession();
  const progress = useSearchProgress();
  const { run } = useSearchPolling();
  const sortMode = useSortMode();
  const frozenUpdatedOnlyIds = useFrozenUpdatedOnlyIds();
  const unviewedCount = useUnviewedUpdatesCount();
  const freezeUpdatedOnly = useFreezeUpdatedOnly();
  const unfreezeUpdatedOnly = useUnfreezeUpdatedOnly();
  const { fullOnly, updatedOnly } = useUrlFilters();
  const filters = { fullOnly, updatedOnly };
  const isDebug =
    typeof window !== 'undefined' &&
    new URL(window.location.href).searchParams.get('debug') === '1';

  const startSearch = useGetStartSearch();
  const setStartSearch = useSetStartSearch();
  const applyFilter = useGetApplyFilter();
  const setApplyFilter = useSetApplyFilter();

  const up = useGetUp();
  const down = useGetDown();
  const date = useGetDate();
  const night = useGetNight();
  const person = useGetPerson();
  const initialDate = useGetInitialDate();

  const setDown = useSetDown();
  const setUp = useSetUp();
  const setNight = useSetNight();
  const setDate = useSetDate();
  const setPerson = useSetPerson();
  const setToCities = useSetToCities();
  const setToCitiesNames = useSetToCitiesNames();

  const [hydrated, setHydrated] = useState(false);
  const [hydrationError, setHydrationError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [countryHotelService, setCountryHotelService] = useState(null);
  // Drawer open/closed. Single state for all viewports — previously desktop
  // had a sticky-sidebar in the layout grid, consuming 360px next to cards
  // and breaking at 810-1100px (cards shrank, elements didn't fit).
  // Now FAB+drawer is a unified pattern, not competing with cards for space.
  const [panelOpen, setPanelOpen] = useState(false);
  // controlsBar pin/unpin: default is sticky, user can unpin.
  const [stickyPinned, setStickyPinned] = useState(true);
  // SortToggle + QualityFilters group: user can collapse/expand.
  const [controlsCollapsed, setControlsCollapsed] = useState(false);
  // ID of the card to which we pass the highlight animation (after jump-to).
  const [highlightedId, setHighlightedId] = useState(null);

  const slots = [night.from, night.from + 1, night.from + 2];
  const hotels = useHotelsForPage(currentPage, PAGE_SIZE, filters, sortMode);
  // Pagination is counted from the FILTERED list, otherwise when a filter
  // is enabled pages remain that have no cards on them.
  const filteredCount = selectOrderedHotelIds(
    session,
    filters,
    sortMode,
    frozenUpdatedOnlyIds,
  ).length;
  const totalHotels = Object.keys(session.hotelsById).length;
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));
  // hasProgress gates the whole controlsBar: on first mount (or page refresh)
  // progress.operatorsTotal === 0 until the first getResults response arrives —
  // rendering an empty wrapper (just the pin button) is pointless.
  // When content is ready (SearchProgress text exists, or at least one card),
  // controlsBar appears in full.
  const hasProgress = !!(progress && progress.operatorsTotal > 0);

  // searchParams — for building links to the hotel page from cards/slots.
  const searchParams = (() => {
    if (!up || !down || !date) return null;
    const { checkIn, checkTo } = buildDateSearchQuery(date, initialDate);
    const fromname =
      typeof up.name === 'string' ? up.name : up.name && up.name[router.locale];
    return {
      transport: up.transport ? up.transport : 'no',
      from: up.value,
      fromname,
      to: down.value,
      checkIn,
      checkTo,
      nights: night.from,
      nightsTo: night.to,
      people: stringifyCrewComposition(person),
    };
  })();

  // Hotel services (for tour_propertys) — separate fetch as in legacy.
  useEffect(() => {
    if (!down || !down.value) return;
    let cancelled = false;
    const countryId = down.countryValue ? down.countryValue : down.value;
    fetch(
      `https://api.otpusk.com/api/2.6/tours/services?countryId=${countryId}` +
        `&lang=${apiLoc}&access_token=${ACCESS_TOKEN}`,
    )
      .then((r) => (r.status === 200 ? r.json() : null))
      .then((data) => {
        if (!cancelled && data) setCountryHotelService(data);
      })
      // eslint-disable-next-line no-console
      .catch((e) => console.log('hotel services fetch failed', e));
    return () => {
      cancelled = true;
    };
  }, [down && down.value, down && down.countryValue, apiLoc]);

  // Mount-only: parseUrl flow when arriving via URL without the form (direct link
  // or page refresh). If startSearch=true — we came via SearchButton click,
  // store is already populated; pass-through, the startSearch effect below will fire.
  useEffect(() => {
    if (startSearch) return undefined;
    let cancelled = false;
    (async () => {
      const res = await parseUrl(router, loc);
      if (cancelled) return;
      if (!res) {
        setHydrationError(true);
        return;
      }
      setDown({ ...res.to });
      setUp({ ...res.from });
      setNight({ from: res.nights, to: res.nightsTo });
      setDate(normalizeDateValue(res.date, initialDate));
      setPerson({ ...res.people });
      setToCities(res.toCities || []);
      setToCitiesNames(res.toCitiesNames || []);
      setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // After hydrating the store from URL — start the search.
  useEffect(() => {
    if (hydrated) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // SearchButton flow: setStartSearch(true) + router.push. Previously worked
  // only on mount (via [] deps), so on an already-open results page a second
  // "Search" click did nothing — no SearchResultV2 remount
  // (after the dynamic fix at module-level). Now a separate effect listens to
  // startSearch and starts a clean cycle: run() → startNewSearch() →
  // resetSession() resets hotelsById, updates, viewedUpdateIds, frozenIds.
  // setStartSearch(false) is set BEFORE run() so the next setStartSearch(true)
  // from the following click fires again.
  useEffect(() => {
    if (!startSearch) return;
    setStartSearch(false);
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSearch]);

  // Apply filter — new cycle (without continueSearch).
  useEffect(() => {
    if (applyFilter) {
      setApplyFilter(false);
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyFilter]);

  // When the first batch arrives — reset currentPage so the user
  // doesn't stay on a page that no longer exists (after a new search).
  useEffect(() => {
    if (session.snapshotVersion === 1) setCurrentPage(1);
  }, [session.snapshotVersion]);

  // Clamp currentPage when the list shrinks (filter enabled / last unviewed
  // cards marked viewed and updatedOnly dropped a hotel).
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // Mobile <810px: globals.css adds `.wrapper { overflow: hidden }` —
  // overflow:hidden on an ancestor creates a scroll-containing block that does
  // NOT itself scroll, which breaks `position: sticky` for .controlsBar. We
  // remove overflow only when the user is actually using sticky (pinned). On
  // unpin or unmount we restore the original value to avoid breaking other
  // horizontally-clipping parts of the page.
  useEffect(() => {
    if (!stickyPinned) return undefined;
    const wrapperEl = document.querySelector('.wrapper');
    if (!wrapperEl) return undefined;
    const prev = wrapperEl.style.overflow;
    wrapperEl.style.overflow = 'visible';
    return () => {
      wrapperEl.style.overflow = prev;
    };
  }, [stickyPinned]);

  // Auto-sync frozen-snapshot for updatedOnly. Covers the page-reload case
  // with ?updatedOnly=1 in the URL — there freeze() was never called because
  // the user-handler in QualityFilters didn't run. Without this the filter
  // self-empties again: observer markViewed clears unviewed → card drops out.
  // Conditions:
  //   - updatedOnly=true + frozen=null + unviewed exist → freeze (snapshot current set)
  //   - updatedOnly=false + frozen!=null → unfreeze (user disabled filter via manual toggle / shallow push)
  useEffect(() => {
    if (updatedOnly && frozenUpdatedOnlyIds === null && unviewedCount > 0) {
      freezeUpdatedOnly();
    } else if (!updatedOnly && frozenUpdatedOnlyIds !== null) {
      unfreezeUpdatedOnly();
    }
  }, [updatedOnly, frozenUpdatedOnlyIds, unviewedCount, freezeUpdatedOnly, unfreezeUpdatedOnly]);

  const handlePageChange = (next) => {
    // Scroll FIRST, switch page SECOND. Doing it the other way round, Chrome
    // scroll anchoring tries to keep the visual anchor near the current scrollY
    // during the list DOM swap — looks like a jump down 150-300px before the
    // smooth scroll back up. With scroll → state the browser is already moving
    // to top:0 by the time of commit, anchor is stable (header/top of document).
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPage(next);
  };

  const handleShowDetails = () => setPanelOpen(true);

  // Jump-to from the panel: switch page, scroll to the card,
  // highlight for 2s (via highlightedId → cardHighlight CSS class).
  // The Phase 4 observer will mark updates as viewed after 1.5s.
  const handleJump = (hotelId) => {
    const target = selectHotelPageIndex(
      session,
      hotelId,
      PAGE_SIZE,
      filters,
      sortMode,
      frozenUpdatedOnlyIds,
    );
    if (target == null) return;
    if (target !== currentPage) setCurrentPage(target);
    setPanelOpen(false);
    setHighlightedId(String(hotelId));
    // requestAnimationFrame ×2 — after the actual reflow with the new page list.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(`hotel-${hotelId}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
    setTimeout(() => setHighlightedId(null), 2200);
  };

  if (hydrationError) {
    return <h4>Error</h4>;
  }

  // Loader is shown only in the idle phase (mount + parseUrl before run()).
  // After run() status='searching' — the indicator is taken over by SearchProgress
  // inside controlsBar (including before the first response arrives).
  const showLoader = status === 'idle';
  // controlsBar appears as soon as search starts, so a cached response
  // doesn't instantly show "Search complete": SearchProgress with its minimum
  // 1s animation will keep "Searching" even when lastResult=true in the first batch.
  const showControlsBar = status === 'searching' || hasProgress || totalHotels > 0;

  return (
    <div className={styles.root}>
      {isDebug && <DebugPanel />}
      <section
        className={`${styles.listColumn} ${isFilterBtnShow ? styles.listStale : ''}`}
        aria-busy={isFilterBtnShow ? 'true' : undefined}
      >
        {showControlsBar && (
          <div
            className={`${styles.controlsBar} ${
              stickyPinned ? '' : styles.controlsBarUnpinned
            }`}
          >
            <div className={styles.toolButtons}>
              <button
                type="button"
                className={`${styles.toolBtn} ${
                  !controlsCollapsed ? styles.toolBtnActive : ''
                }`}
                onClick={() => setControlsCollapsed((v) => !v)}
                aria-label={intl.formatMessage({
                  id: controlsCollapsed ? 'controls.expand' : 'controls.collapse',
                })}
                aria-expanded={!controlsCollapsed}
                title={intl.formatMessage({
                  id: controlsCollapsed ? 'controls.expand' : 'controls.collapse',
                })}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {controlsCollapsed ? (
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  ) : (
                    <path d="M19 13H5v-2h14v2z" />
                  )}
                </svg>
              </button>
              <button
                type="button"
                className={`${styles.toolBtn} ${stickyPinned ? styles.toolBtnActive : ''}`}
                onClick={() => setStickyPinned((v) => !v)}
                aria-label={intl.formatMessage({
                  id: stickyPinned ? 'controls.unpin' : 'controls.pin',
                })}
                aria-pressed={stickyPinned}
                title={intl.formatMessage({
                  id: stickyPinned ? 'controls.unpin' : 'controls.pin',
                })}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    transform: stickyPinned ? 'rotate(0deg)' : 'rotate(45deg)',
                    transition: 'transform 0.2s ease',
                  }}
                >
                  <path d="M16 9V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1 1-1v-7H19v-2c-1.66 0-3-1.34-3-3z" />
                </svg>
              </button>
            </div>
            <SearchProgress />
            {totalHotels > 0 && (
              <>
                <div
                  className={`${styles.toolsGroup} ${
                    controlsCollapsed ? styles.toolsGroupCollapsed : ''
                  }`}
                >
                  <div className={styles.toolsGroupInner}>
                    <SortToggle />
                    <QualityFilters />
                  </div>
                </div>
                <UpdatesBanner
                  hotelsOnPage={hotels}
                  onShowDetails={handleShowDetails}
                />
              </>
            )}
          </div>
        )}
        {showLoader && <Loader />}
        {totalHotels === 0 && status === 'done' && (
          <div>
            <FM id="result.no_res" />
          </div>
        )}
        {totalHotels > 0 && searchParams && (
          <HotelList
            hotels={hotels}
            searchParams={searchParams}
            countryHotelService={
              countryHotelService && countryHotelService.icons
                ? countryHotelService.icons
                : []
            }
            slots={slots}
            highlightedId={highlightedId}
          />
        )}
        {totalPages > 1 && (
          <div className={styles.paginationWrapper}>
            <Pagination
              curr={currentPage}
              pagesCount={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
        {totalHotels > 0 && (
          <>
            <ContinueSearchButton
              onContinue={() => {
                // Scroll first, run() second — same reasoning as handlePageChange:
                // avoid Chrome scroll anchoring jolting the page during the DOM
                // diff that follows a new search cycle.
                window.scrollTo({ top: 0, behavior: 'smooth' });
                run({ continueSearch: true });
              }}
            />
          </>
        )}
      </section>
      <UpdatesDrawer
        open={panelOpen}
        onOpenToggle={setPanelOpen}
        onJump={handleJump}
      />
    </div>
  );
}
