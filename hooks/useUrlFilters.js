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
      const next = { ...router.query };
      if (value) next[name] = '1';
      else delete next[name];
      router.push({ pathname: router.pathname, query: next }, undefined, {
        shallow: true,
      });
    },
    [router],
  );

  return { fullOnly, updatedOnly, setFilter };
}
