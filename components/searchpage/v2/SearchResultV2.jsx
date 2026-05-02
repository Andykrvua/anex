import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FormattedMessage as FM } from 'react-intl';
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
import getViewport from 'utils/getViewport';
import {
  selectHotelPageIndex,
  selectOrderedHotelIds,
} from 'utils/searchMerge';
import useUrlFilters from 'hooks/useUrlFilters';
import {
  useSearchSession,
  useSearchStatus,
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
import LoadMoreCallout from './panel/LoadMoreCallout';
import SortToggle from './controls/SortToggle';
import QualityFilters from './controls/QualityFilters';
import HotelList from './list/HotelList';
import DebugPanel from './dev/DebugPanel';
import styles from './SearchResultV2.module.css';

const PAGE_SIZE = 20;
const ACCESS_TOKEN = '337da-65e22-26745-a251f-77b9e';

/**
 * v2 точка монтирования. Phase 3 — добавлен список + пагинация.
 *
 * Триггеры запуска копируем из legacy <SearchResult />:
 *  - mount + startSearch=true → run() сразу.
 *  - mount + startSearch=false → parseUrl, заливаем в store, run().
 *  - applyFilter=true → run() (новый цикл).
 *  - "Продолжить" → run({ continueSearch: true }).
 */
export default function SearchResultV2({ isFilterBtnShow = false }) {
  const router = useRouter();
  const loc = router.locale === 'uk' ? 'ua' : 'ru';
  const apiLoc = router.locale === 'uk' ? 'ua' : 'ru';
  const status = useSearchStatus();
  const session = useSearchSession();
  const { run } = useSearchPolling();
  const sortMode = useSortMode();
  const frozenUpdatedOnlyIds = useFrozenUpdatedOnlyIds();
  const unviewedCount = useUnviewedUpdatesCount();
  const freezeUpdatedOnly = useFreezeUpdatedOnly();
  const unfreezeUpdatedOnly = useUnfreezeUpdatedOnly();
  const { fullOnly, updatedOnly } = useUrlFilters();
  const filters = { fullOnly, updatedOnly };
  const viewport = getViewport();
  const isMobile = viewport && viewport.width < 810;
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
  // Drawer открыт/закрыт. Один state на все viewport — раньше desktop
  // имел sticky-sidebar в layout-сетке, что съедало 360px рядом с карточками
  // и ломалось на 810-1100px (карточки сжимались, элементы не помещались).
  // Теперь FAB+drawer — единый паттерн, не конкурирует с карточками за место.
  const [panelOpen, setPanelOpen] = useState(false);
  // ID карточки, которой прокидываем highlight-анимацию (после jump-to).
  const [highlightedId, setHighlightedId] = useState(null);

  const slots = [night.from, night.from + 1, night.from + 2];
  const hotels = useHotelsForPage(currentPage, PAGE_SIZE, filters, sortMode);
  // Пагинация считается от ОТФИЛЬТРОВАННОГО списка, иначе при включении
  // фильтра остаются страницы, на которых нет ни одной карточки.
  const filteredCount = selectOrderedHotelIds(
    session,
    filters,
    sortMode,
    frozenUpdatedOnlyIds,
  ).length;
  const totalHotels = Object.keys(session.hotelsById).length;
  const totalPages = Math.max(1, Math.ceil(filteredCount / PAGE_SIZE));

  // searchParams — для построения ссылок на hotel-страницу из карточек/слотов.
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

  // Hotel services (для tour_propertys) — отдельный fetch как в legacy.
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

  // Mount-only: parseUrl flow когда зашли по URL без формы (direct link
  // или refresh страницы). Если startSearch=true — мы пришли по клику
  // SearchButton, store уже наполнен; pass-through, ниже отработает
  // startSearch-эффект.
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

  // После гидрации store из URL — стартуем поиск.
  useEffect(() => {
    if (hydrated) run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);

  // SearchButton flow: setStartSearch(true) + router.push. Раньше работало
  // только на mount (через [] deps), а на уже открытой странице результатов
  // повторный клик "Поиск" ничего не делал — ремаунта SearchResultV2 нет
  // (после фикса dynamic на module-level). Теперь отдельный эффект слушает
  // startSearch и запускает чистый цикл: run() → startNewSearch() →
  // resetSession() сбрасывает hotelsById, updates, viewedUpdateIds, frozenIds.
  // setStartSearch(false) ставим ДО run() чтобы повторный setStartSearch(true)
  // от следующего клика снова отработал.
  useEffect(() => {
    if (!startSearch) return;
    setStartSearch(false);
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startSearch]);

  // Apply filter — новый цикл (без continueSearch).
  useEffect(() => {
    if (applyFilter) {
      setApplyFilter(false);
      run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyFilter]);

  // При получении первого batch'а — обнуляем currentPage, чтобы юзер
  // не оставался на странице, которой больше нет (после нового search).
  useEffect(() => {
    if (session.snapshotVersion === 1) setCurrentPage(1);
  }, [session.snapshotVersion]);

  // Clamp currentPage при сжатии списка (включили фильтр / пометили
  // последние unviewed просмотренными и updatedOnly выкинул отель).
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [currentPage, totalPages]);

  // Auto-sync frozen-snapshot для updatedOnly. Покрывает кейс перезагрузки
  // страницы с ?updatedOnly=1 в URL — там freeze() не вызывался, потому что
  // user-handler в QualityFilters не отрабатывал. Без этого фильтр снова
  // self-empties: observer markViewed снимает unviewed → карточка вылетает.
  // Условия:
  //   - updatedOnly=true + frozen=null + есть unviewed → freeze (snapshot текущего набора)
  //   - updatedOnly=false + frozen!=null → unfreeze (юзер выключил фильтр через manual toggle / shallow push)
  useEffect(() => {
    if (updatedOnly && frozenUpdatedOnlyIds === null && unviewedCount > 0) {
      freezeUpdatedOnly();
    } else if (!updatedOnly && frozenUpdatedOnlyIds !== null) {
      unfreezeUpdatedOnly();
    }
  }, [updatedOnly, frozenUpdatedOnlyIds, unviewedCount, freezeUpdatedOnly, unfreezeUpdatedOnly]);

  const handlePageChange = (next) => {
    setCurrentPage(next);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  };

  const handleShowDetails = () => setPanelOpen(true);

  // Jump-to из панели: переключаем страницу, скроллим к карточке,
  // подсвечиваем 2с (через highlightedId → cardHighlight CSS-класс).
  // Observer из Phase 4 пометит updates просмотренными после 1.5с.
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
    // requestAnimationFrame ×2 — после реального reflow со списком новой страницы.
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

  const showLoader = status === 'idle' || (status === 'searching' && totalHotels === 0);

  return (
    <div className={styles.root}>
      {isDebug && <DebugPanel />}
      <SearchProgress />
      <UpdatesBanner hotelsOnPage={hotels} onShowDetails={handleShowDetails} />
      <section
        className={`${styles.listColumn} ${isFilterBtnShow ? styles.listStale : ''}`}
        aria-busy={isFilterBtnShow ? 'true' : undefined}
      >
        {totalHotels > 0 && (
          <>
            <SortToggle />
            <QualityFilters />
          </>
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
            <LoadMoreCallout
              hotelsOnPage={hotels}
              onOpenPanel={handleShowDetails}
            />
            <ContinueSearchButton
              onContinue={() => {
                run({ continueSearch: true });
                // Скрол наверх — параллельно с пагинацией (см. handlePageChange).
                // Юзер должен увидеть прогресс/первые результаты continuation,
                // а не остаться внизу под старым списком.
                setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
              }}
            />
          </>
        )}
      </section>
      <UpdatesDrawer
        open={panelOpen}
        onOpenToggle={setPanelOpen}
        onJump={handleJump}
        isMobile={isMobile}
      />
    </div>
  );
}
