import create from 'zustand';
import { devtools } from 'zustand/middleware';
import {
  applySnapshot,
  createEmptySession,
  resetSession,
  selectGroupedUpdates,
  selectHotelHasUnviewedUpdate,
  selectHotelsForPage,
  selectHotelUnviewedUpdates,
  selectUnviewedCount,
} from '../utils/searchMerge';

// Изолированный slice сессии поиска. Живёт отдельно от store/store.js,
// чтобы не цеплять остальное приложение и чтобы Фаза 10 могла удалить
// часть legacy полей без миграций. Persist НЕ применяем — search session
// эфемерна, не хочется восстанавливать её из localStorage.

export const useSearchStore = create(
  devtools(
    (set) => ({
      session: createEmptySession(),

      // UI-preference: режим сортировки.
      // sortMode: 'stable' | 'price_asc' | 'price_desc' | 'rating_desc'.
      // Дефолт 'stable' — список держит порядок появления, новые отели в хвост.
      // Это выполняет Phase 7-acceptance "позиции не скачут при тиках".
      // Юзер, выбирая не-stable, осознанно соглашается на reordering при ingest.
      sortMode: 'stable',

      // Snapshot id-шников для фильтра "Только с обновлениями".
      // null — фильтр выключен. Массив — заморожённый список на момент включения.
      // Без этого observer markViewed снимал бейджи и фильтр самопустошался:
      // карточки одна за одной вылетали из выборки, как только в viewport
      // отрабатывал 1.5s dwell. Frozen — стабильный набор, скрол по нему
      // нормально снимает viewed без побочных эффектов на сам список.
      frozenUpdatedOnlyIds: null,

      setSortMode: (mode) =>
        set(() => ({ sortMode: mode }), false, 'setSortMode'),

      freezeUpdatedOnly: () =>
        set(
          (state) => {
            const ids = state.session.order.filter((id) =>
              selectHotelHasUnviewedUpdate(state.session, id),
            );
            return { frozenUpdatedOnlyIds: ids };
          },
          false,
          'freezeUpdatedOnly',
        ),

      unfreezeUpdatedOnly: () =>
        set({ frozenUpdatedOnlyIds: null }, false, 'unfreezeUpdatedOnly'),

      startNewSearch: (params) =>
        set(
          () => ({
            session: resetSession({ params }),
            // Новый поиск — обнуляем заморозку фильтра. Иначе старый
            // массив id-шников переживёт reset и станет невалидным.
            frozenUpdatedOnlyIds: null,
          }),
          false,
          'startNewSearch',
        ),

      ingestSnapshot: (apiPayload, slots) =>
        set(
          (state) => ({ session: applySnapshot(state.session, apiPayload, slots) }),
          false,
          'ingestSnapshot',
        ),

      setStatus: (status) =>
        set(
          (state) => ({ session: { ...state.session, status } }),
          false,
          'setStatus',
        ),

      // Hard-timeout polling-цикла. Просто status='done' недостаточно:
      // ContinueSearchButton показывается только при isLastResult=true
      // (легитимный сигнал от сервера "это всё на этой странице").
      // Без timedOut/isLastResult-сигнала юзер оставался бы в тупике —
      // ни кнопки "Продолжить", ни сообщения о таймауте.
      finishCycleByTimeout: () =>
        set(
          (state) => ({
            session: {
              ...state.session,
              status: 'done',
              isLastResult: true,
              timedOut: true,
            },
          }),
          false,
          'finishCycleByTimeout',
        ),

      markUpdatesViewed: (updateIds) =>
        set(
          (state) => {
            const next = new Set(state.session.viewedUpdateIds);
            updateIds.forEach((id) => next.add(id));
            return { session: { ...state.session, viewedUpdateIds: next } };
          },
          false,
          'markUpdatesViewed',
        ),

      markAllViewed: () =>
        set(
          (state) => ({
            session: {
              ...state.session,
              viewedUpdateIds: new Set(state.session.updates.map((u) => u.id)),
            },
          }),
          false,
          'markAllViewed',
        ),

      requestNextServerPage: () =>
        set(
          (state) => ({
            session: {
              ...state.session,
              pageNumber: state.session.pageNumber + 1,
              status: 'searching',
              // Сбрасываем сигналы прошлого цикла, иначе ContinueSearchButton
              // не уйдёт в "searching"-режим, а timeout-hint всплывёт повторно.
              isLastResult: false,
              timedOut: false,
              continuationMark: {
                hotelsCount: Object.keys(state.session.hotelsById).length,
                updatesCount: state.session.updates.length,
              },
            },
          }),
          false,
          'requestNextServerPage',
        ),
    }),
    { name: 'searchStore' },
  ),
);

// ---------------------------------------------------------------------
// Selector hooks — единый стиль с store/store.js (use* + Get/Set).
// ---------------------------------------------------------------------

export const useSearchSession = () => useSearchStore((s) => s.session);
export const useSearchProgress = () => useSearchStore((s) => s.session.progress);
export const useSearchStatus = () => useSearchStore((s) => s.session.status);
export const useIsLastResult = () => useSearchStore((s) => s.session.isLastResult);
export const useHasMoreServerPages = () =>
  useSearchStore((s) => s.session.hasMoreServerPages);
export const useSearchTimedOut = () =>
  useSearchStore((s) => !!s.session.timedOut);
export const useSearchPageNumber = () =>
  useSearchStore((s) => s.session.pageNumber);

export const useHotelsForPage = (page, pageSize, filters, sortMode) =>
  useSearchStore((s) =>
    selectHotelsForPage(
      s.session,
      page,
      pageSize,
      filters,
      sortMode,
      s.frozenUpdatedOnlyIds,
    ),
  );

export const useFrozenUpdatedOnlyIds = () =>
  useSearchStore((s) => s.frozenUpdatedOnlyIds);

export const useUnviewedUpdatesCount = () =>
  useSearchStore((s) => selectUnviewedCount(s.session));

export const useGroupedUpdates = () =>
  useSearchStore((s) => selectGroupedUpdates(s.session));

export const useHotelUnviewedUpdates = (hotelId) =>
  useSearchStore((s) => selectHotelUnviewedUpdates(s.session, hotelId));

export const useSortMode = () => useSearchStore((s) => s.sortMode);

// Action hooks
export const useStartNewSearch = () => useSearchStore((s) => s.startNewSearch);
export const useIngestSnapshot = () => useSearchStore((s) => s.ingestSnapshot);
export const useSetSearchStatus = () => useSearchStore((s) => s.setStatus);
export const useFinishCycleByTimeout = () =>
  useSearchStore((s) => s.finishCycleByTimeout);
export const useMarkUpdatesViewed = () => useSearchStore((s) => s.markUpdatesViewed);
export const useMarkAllViewed = () => useSearchStore((s) => s.markAllViewed);
export const useRequestNextServerPage = () =>
  useSearchStore((s) => s.requestNextServerPage);
export const useSetSortMode = () => useSearchStore((s) => s.setSortMode);
export const useFreezeUpdatedOnly = () =>
  useSearchStore((s) => s.freezeUpdatedOnly);
export const useUnfreezeUpdatedOnly = () =>
  useSearchStore((s) => s.unfreezeUpdatedOnly);
