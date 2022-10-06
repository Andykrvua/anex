import styles from './searchContent.module.css';
import { useGetFilter, useSetFilter } from 'store/store';
import FilterMobileTemplate from './filterMobileTemplate';
import FilterContent from './filterContent';
import getViewport from 'utils/getViewport';
import { useEffect } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import CloseSvg from 'components/common/closeSvg';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';

export default function SearchContent() {
  const getFilterModale = useGetFilter();
  const setFilterModale = useSetFilter();
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
            <FilterContent />
          </FilterMobileTemplate>
        </div>
      )}
      {windowSize.width > 809 && (
        <div>
          <div className={styles.filter_header}>
            <h3 className={styles.title}>
              <FM id="result.filter.title" />
            </h3>
            <button className={`${styles.reset_btn} svg_btn_stroke`}>
              <FM id="result.filter.reset" />
              <CloseSvg />
            </button>
          </div>
          <FilterContent />
        </div>
      )}
      <div>Content</div>
    </div>
  );
}
