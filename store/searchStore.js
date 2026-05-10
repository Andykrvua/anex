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

// Isolated search session slice. Lives separately from store/store.js
// to avoid coupling the rest of the app and so Phase 10 can remove
// some legacy fields without migrations. Persist is NOT applied — the search
// session is ephemeral, we don't want to restore it from localStorage.

export const useSearchStore = create(
  devtools(
    (set) => ({
      session: createEmptySession(),

      // UI preference: sort mode.
      // sortMode: 'stable' | 'price_asc' | 'price_desc' | 'rating_desc'.
      // Default 'stable' — list keeps arrival order, new hotels appended to the end.
      // This satisfies Phase 7 acceptance "positions don't jump on ticks".
      // A user choosing non-stable consciously accepts reordering on ingest.
      sortMode: 'stable',

      // "Updated only" client filter (in-memory, NOT URL-persisted): updates
      // appear only after "Continue search" / poll cycles, so on a fresh
      // page load there are never any updates and persisting this in URL
      // serves no purpose — checkbox would always start disabled.
      updatedOnly: false,

      // Snapshot of hotel ids paired with `updatedOnly`. null when off,
      // array of frozen ids when on. Without this the observer markViewed
      // cleared badges and the filter self-emptied: cards dropped from the
      // set one by one as the 1.5s dwell fired in the viewport.
      frozenUpdatedOnlyIds: null,

      setSortMode: (mode) =>
        set(() => ({ sortMode: mode }), false, 'setSortMode'),

      // Toggle the "Updated only" filter atomically with its frozen snapshot.
      // ON: capture current ids of hotels that have unviewed updates.
      // OFF: clear the snapshot.
      setUpdatedOnly: (value) =>
        set(
          (state) => {
            if (value) {
              const ids = state.session.order.filter((id) =>
                selectHotelHasUnviewedUpdate(state.session, id),
              );
              return { updatedOnly: true, frozenUpdatedOnlyIds: ids };
            }
            return { updatedOnly: false, frozenUpdatedOnlyIds: null };
          },
          false,
          'setUpdatedOnly',
        ),

      startNewSearch: (params) =>
        set(
          () => ({
            session: resetSession({ params }),
            // New search — reset the filter and its freeze snapshot.
            updatedOnly: false,
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

      // Hard-timeout of the polling cycle. Just status='done' is not enough:
      // ContinueSearchButton is shown only when isLastResult=true
      // (a legitimate server signal "this is everything on this page").
      // Without the timedOut/isLastResult signal the user would be stuck —
      // no "Continue" button and no timeout message.
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
              // Reset signals from the previous cycle, otherwise ContinueSearchButton
              // won't enter "searching" mode and the timeout hint will re-appear.
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
// Selector hooks — same style as store/store.js (use* + Get/Set).
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

export const useUpdatedOnly = () => useSearchStore((s) => s.updatedOnly);

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
export const useSetUpdatedOnly = () =>
  useSearchStore((s) => s.setUpdatedOnly);
