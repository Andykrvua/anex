import { useRouter } from 'next/router';
import { useCallback } from 'react';

/**
 * URL-persisted client filters: `?fullOnly=1`. Page reload preserves it.
 * `updatedOnly` is intentionally NOT in URL — it depends on data that
 * appears only after polling, so persisting it across reloads is useless.
 *
 * Race with router.isReady: before hydration router.query is empty → false.
 * This is OK for UX: the user sees the full list, flag is picked up after ready.
 *
 * Returns: values + setter `setFilter(name, boolean)` that does a
 * shallow-push (without re-mounting the page).
 */
export default function useUrlFilters() {
  const router = useRouter();
  const fullOnly = router.query.fullOnly === '1';

  const setFilter = useCallback(
    (name, value) => {
      // Read from window.location, not router.query — FilterContent updates
      // stars/food/services via window.history.pushState (bypasses Next.js
      // router), so router.query is stale and using it as the base would
      // strip those params on push and cause a spurious "Apply filters" diff.
      const url = new URL(window.location.href);
      if (value) url.searchParams.set(name, '1');
      else url.searchParams.delete(name);
      router.push(url.pathname + url.search, undefined, { shallow: true });
    },
    [router],
  );

  return { fullOnly, setFilter };
}
