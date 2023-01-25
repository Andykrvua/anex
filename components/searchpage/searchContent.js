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

export default function SearchContent() {
  // const [filterFluid, setFilterFluid] = useState(false);
  const getFilterModale = useGetFilterOpen();
  const setFilterModale = useSetFilterOpen();
  const filterData = useGetSearchFilter();
  const setFilterData = useSetSearchFilter();
  const setApplyFilter = useSetApplyFilter();

  const windowSize = getViewport();
  const filterBlock = useRef(null);
  const filterBlockWrapper = useRef(null);

  const scrollControl = useRef(0);

  const filterBlockStart = useRef(null);
  const filterBlockEnd = useRef(null);
  const filterBlockBottom = useRef(null);
  const filterBlockTop = useRef(null);
  console.log('filterBlock.current', filterBlock.current);

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

  // const onScroll = () => {
  //   if (filterBlock.current) {
  //     // console.log('scrollY =', window?.scrollY);
  //     // console.log('width wrapper', filterBlockWrapper.current.offsetHeight);
  //     // console.log('width block', filterBlock.current.offsetHeight);
  //     // console.log('block top', filterBlock.current.offsetTop);
  //     // console.log('wrapper top', filterBlockWrapper.current.offsetTop);
  //     if (
  //       filterBlockWrapper.current?.offsetHeight >
  //       filterBlock.current?.offsetHeight
  //     ) {
  //       console.log('q1q1q1');
  //       // setFilterFluid(true);
  //       const parrent = filterBlockWrapper.current?.offsetHeight;
  //       const child = filterBlock.current?.offsetHeight;
  //       const diff = parrent - child;
  //       console.log('diff', diff);
  //       const { top } = filterBlock.current.getBoundingClientRect();
  //       console.log('top', top);
  //       if (top < 111) {
  //         if (111 - top > diff) return;
  //         console.log('transform', 111 + window?.scrollY);
  //         console.log('window?.scrollY', window?.scrollY);
  //         filterBlock.current.style.transform = `translateY(${-top}px)`;
  //       }
  //     }
  //   }
  // };

  const onScroll = () => {
    if (scrollControl.current.scroll > window.scrollY) {
      // console.log('up');
      scrollControl.current = {
        ...scrollControl.current,
        scroll: window.scrollY,
        dir: 'up',
      };
    }
    if (scrollControl.current.scroll < window.scrollY) {
      // console.log('down');
      scrollControl.current = {
        ...scrollControl.current,
        scroll: window.scrollY,
        dir: 'down',
      };
    }
  };

  const observerCallback = (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        scrollControl.current = {
          ...scrollControl.current,
          [entry.target.className]: true,
        };
      } else {
        scrollControl.current = {
          ...scrollControl.current,
          [entry.target.className]: false,
        };
      }
    });

    if (scrollControl.current.end) {
      filterBlock.current.style.position = 'fixed';
      filterBlock.current.style.bottom = '0px';
      filterBlock.current.style.top = 'unset';
    }
    if (scrollControl.current.bottom) {
      filterBlock.current.style.position = 'absolute';
      filterBlock.current.style.bottom = '0px';
      filterBlock.current.style.top = 'unset';
    }
    if (scrollControl.current.dir === 'up' && scrollControl.current.start) {
      filterBlock.current.style.position = 'fixed';
      filterBlock.current.style.bottom = 'unset';
      filterBlock.current.style.top = '115px';
    }
    if (
      scrollControl.current.dir === 'up' &&
      scrollControl.current.start &&
      scrollControl.current.top
    ) {
      filterBlock.current.style.position = 'relative';
      filterBlock.current.style.bottom = 'unset';
      filterBlock.current.style.top = 'unset';
    }
    if (
      !scrollControl.current.bottom &&
      scrollControl.current.end &&
      filterBlock.current?.style.bottom === '0px' &&
      scrollControl.current.dir === 'up'
    ) {
      filterBlock.current.style.position = 'absolute';
      filterBlock.current.style.bottom = 'unset';
      filterBlock.current.style.top = `${scrollControl.current.scroll}px`;
    }
    if (
      !scrollControl.current.top &&
      scrollControl.current.start &&
      filterBlock.current?.style.top === '115px' &&
      scrollControl.current.dir === 'down'
    ) {
      filterBlock.current.style.position = 'absolute';
      filterBlock.current.style.bottom = 'unset';
      filterBlock.current.style.top = `${scrollControl.current.scroll}px`;
    }
  };

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0,
  };

  // useEffect(() => {
  //   const observer = new IntersectionObserver(observerCallback, options);
  //   if (filterBlockStart.current) {
  //     observer.observe(filterBlockStart.current);
  //   }
  //   if (filterBlockEnd.current) {
  //     observer.observe(filterBlockEnd.current);
  //   }
  //   if (filterBlockBottom.current) {
  //     observer.observe(filterBlockBottom.current);
  //   }
  //   if (filterBlockTop.current) {
  //     observer.observe(filterBlockTop.current);
  //   }

  //   return () => {
  //     if (filterBlockStart.current) {
  //       observer.unobserve(filterBlockStart.current);
  //     }
  //     if (filterBlockEnd.current) {
  //       observer.unobserve(filterBlockEnd.current);
  //     }
  //     if (filterBlockBottom.current) {
  //       observer.unobserve(filterBlockBottom.current);
  //     }
  //     if (filterBlockTop.current) {
  //       observer.unobserve(filterBlockTop.current);
  //     }
  //   };
  // }, [filterBlockStart, filterBlockEnd, filterBlockBottom, filterBlockTop]);

  // useEffect(() => {
  //   scrollControl.current = {
  //     scroll: window.scrollY,
  //     dir: '',
  //     top: false,
  //     bottom: false,
  //     start: false,
  //     end: false,
  //   };
  //   window.removeEventListener('scroll', onScroll);
  //   window.addEventListener('scroll', onScroll, { passive: true });
  //   return () => window.removeEventListener('scroll', onScroll);
  // }, []);

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
        <div ref={filterBlockWrapper} className={styles.filter_content_wrapper}>
          <div
            ref={filterBlockTop}
            style={{
              height: '1px',
              backgroundColor: 'red',
              position: 'absolute',
              top: 0,
              width: '100%',
            }}
            className="top"
          />
          <div
            ref={filterBlock}
            // className={filterFluid ? styles.filter_fluid : null}
            className={styles.filter_float}
          >
            <div
              style={{ height: '1px', backgroundColor: 'red' }}
              ref={filterBlockStart}
              className="start"
            />
            <FilterContent mobile={false} filteredSearch={filteredSearch} />
            <div
              style={{ height: '1px', backgroundColor: 'red' }}
              ref={filterBlockEnd}
              className="end"
            />
          </div>
          <div
            ref={filterBlockBottom}
            style={{
              height: '1px',
              backgroundColor: 'red',
              position: 'absolute',
              bottom: 0,
              width: '100%',
            }}
            className="bottom"
          />
        </div>
      )}
      <SearchResult />
    </div>
  );
}
