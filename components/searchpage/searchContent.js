import styles from './searchContent.module.css';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';
import { useEffect, useState } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import StickyBox from 'react-sticky-box';
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
import { isBrowser } from 'utils/utils';

export default function SearchContent() {
  const getFilterModale = useGetFilterOpen();
  const setFilterModale = useSetFilterOpen();
  const filterData = useGetSearchFilter();
  const setFilterData = useSetSearchFilter();
  const setApplyFilter = useSetApplyFilter();
  const windowSize = getViewport();

  const getParams = () => {
    const currentURL = window.location.href;
    const newURL = new URL(currentURL);
    const price = newURL.searchParams.get('price');
    const priceTo = newURL.searchParams.get('priceTo');
    const stars = newURL.searchParams.get('stars');
    const food = newURL.searchParams.get('food');
    const services = newURL.searchParams.get('services');

    return {
      price,
      priceTo,
      stars,
      food,
      services,
    };
  };

  const [urlParams, setUrlParams] = useState(getParams());

  let isButtonShow = false;
  if (JSON.stringify(getParams()) === JSON.stringify(urlParams)) {
    isButtonShow = false;
  } else {
    isButtonShow = true;
  }

  useEffect(() => {
    if (filterData.reset) {
      setUrlParams(getParams());
    }
  }, [filterData]);

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

  const filteredSearch = async () => {
    if (isBrowser() && windowSize.width > 809) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    setTimeout(() => {
      setUrlParams(getParams());
      setApplyFilter(true);
    }, 500);
  };

  return (
    <div className={styles.search_wrapper}>
      {windowSize.width < 810 && (
        <div className={getFilterModale ? 'main_form_popup filter open' : 'main_form_popup filter'}>
          <FilterMobileTemplate
            filteredSearch={filteredSearch}
            filterData={filterData}
            isButtonShow={isButtonShow}
          >
            <FilterContent mobile={true} />
          </FilterMobileTemplate>
        </div>
      )}

      {windowSize.width >= 810 && (
        <div className={styles.filter_content_wrapper}>
          {isButtonShow && (
            <div className={styles.filter_btn}>
              <button className="apply_btn" onClick={() => filteredSearch()} style={{ padding: '24px 36px' }}>
                <FM id="result.filter.apply" />
              </button>
            </div>
          )}
          <StickyBox offsetTop={110} offsetBottom={25}>
            <FilterContent mobile={false} />
          </StickyBox>
        </div>
      )}
      <SearchResult isFilterBtnShow={isButtonShow} />
    </div>
  );
}
