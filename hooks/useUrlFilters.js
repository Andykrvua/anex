import { useRouter } from 'next/router';
import { useCallback } from 'react';

/**
 * Quality-filters in URL: `?fullOnly=1` / `?updatedOnly=1`.
 * Page reload preserves them.
 *
 * Race with router.isReady: before hydration router.query is empty → filters=false.
 * This is OK for UX: the user sees the full list, flags are picked up after ready.
 *
 * Returns: values + setter `setFilter(name, boolean)` that does a
 * shallow-push (without re-mounting the page).
 */
export default function useUrlFilters() {
  const router = useRouter();
  const fullOnly = router.query.fullOnly === '1';
  const updatedOnly = router.query.updatedOnly === '1';

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

  return { fullOnly, updatedOnly, setFilter };
}
