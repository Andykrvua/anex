import styles from './searchContent.module.css';
import { useGetFilterOpen, useSetFilterOpen } from 'store/store';
import FilterMobileTemplate from './filter/filterMobileTemplate';
import FilterContent from './filter/filterContent';
import SearchResult from './searchResult/searchResult';
import getViewport from 'utils/getViewport';
import { useEffect } from 'react';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';

export default function SearchContent() {
  const getFilterModale = useGetFilterOpen();
  const setFilterModale = useSetFilterOpen();

  const windowSize = getViewport();

  useEffect(() => {
    if (windowSize.width > 809) {
      setFilterModale(false);
    }
  }, [windowSize.width]);

  useEffect(() => {
    const BODY = document.querySelector('body');
    const SCROLLABLE = document.querySelector('.filter_scrollable');
    if (getFilterModale) {
      lock(BODY);
      unlock(SCROLLABLE);
      BODY.classList.add('iosfix');
    } else {
      BODY.classList.remove('iosfix');
      clearBodyLocks();
    }
  }, [getFilterModale]);

  return (
    <div className={styles.search_wrapper}>
      {windowSize.width < 810 && (
        <div
          className={
            getFilterModale
              ? 'main_form_popup filter open'
              : 'main_form_popup filter'
          }
        >
          <FilterMobileTemplate>
            <FilterContent mobile={true} />
          </FilterMobileTemplate>
        </div>
      )}
      {windowSize.width >= 810 && (
        <div>
          <div>
            <FilterContent mobile={false} />
          </div>
        </div>
      )}
      <SearchResult />
    </div>
  );
}
