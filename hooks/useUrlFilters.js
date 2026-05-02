import { useRouter } from 'next/router';
import { useCallback } from 'react';

/**
 * Quality-filters в URL: `?fullOnly=1` / `?updatedOnly=1`.
 * Перезагрузка страницы их сохраняет.
 *
 * Race с router.isReady: до гидратации router.query пуст → filters=false.
 * Это OK для UX: юзер видит full list, после ready подхватятся флаги.
 *
 * Возврат: значения + сеттер `setFilter(name, boolean)`, который делает
 * shallow-push (без re-mount страницы).
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
