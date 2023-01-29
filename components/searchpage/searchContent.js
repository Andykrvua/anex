import styles from './searchContent.module.css';
import {
  useGetFilterOpen,
  useSetFilterOpen,
  useGetSearchFilter,
  useSetSearchFilter,
  useSetApplyFilter,
} from 'store/store';
import FilterMobileTemplate from './filter/filterMobileTemplate';
import FilterContent from './filter/filterContent';
import SearchResult from './searchResult/searchResult';
import getViewport from 'utils/getViewport';
import { useEffect, useRef, useState } from 'react';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';
import StickyBox from 'react-sticky-box';

export default function SearchContent() {
  // const [filterFluid, setFilterFluid] = useState(false);
  const getFilterModale = useGetFilterOpen();
  const setFilterModale = useSetFilterOpen();
  const filterData = useGetSearchFilter();
  const setFilterData = useSetSearchFilter();
  const setApplyFilter = useSetApplyFilter();

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

  const filteredSearch = () => {
    const changeHelper = (arr1, arr2) => {
      // eslint-disable-next-line
      let unique = new Set();
      // eslint-disable-next-line
      let unique2 = new Set(arr2);
      arr1.forEach((el) => unique.add(el));
      [...unique2].forEach((el) => {
        if (unique.has(el)) {
          unique.delete(el);
        } else {
          unique.add(el);
        }
      });
      return [...unique];
    };

    setFilterData({
      ...filterData,
      btnTrigger: false,
      default: {
        ...filterData.newData,
        change: [
          ...changeHelper(filterData.default.change, filterData.newData.change),
        ],
        cost: filterData.newData.cost.length
          ? filterData.newData.cost
          : filterData.default.cost,
      },
      newData: { ...filterData.newData, change: [] },
    });
    setApplyFilter(true);
  };

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
          <FilterMobileTemplate
            filteredSearch={filteredSearch}
            filterData={filterData}
          >
            <FilterContent mobile={true} />
          </FilterMobileTemplate>
        </div>
      )}

      {windowSize.width >= 810 && (
        <div className={styles.filter_content_wrapper}>
          {filterData.btnTrigger && (
            <div className={styles.filter_btn}>
              <button
                className="apply_btn"
                onClick={() => filteredSearch()}
                style={{ padding: '24px 36px' }}
              >
                Применить фильтры
              </button>
            </div>
          )}
          <StickyBox offsetTop={110} offsetBottom={25}>
            <FilterContent mobile={false} />
          </StickyBox>
        </div>
      )}
      <SearchResult />
    </div>
  );
}
