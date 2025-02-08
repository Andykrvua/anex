import { FormattedMessage as FM } from 'react-intl';
import styles from './searchHeader.module.css';
import { useRouter } from 'next/router';
import {
  useGetDown,
  useGetDate,
  useSetFilterOpen,
  useSetSearchResultSort,
  useGetSearchResultSort,
} from 'store/store';

export default function SearchHeader() {
  const router = useRouter();
  const loc = router.locale;

  const down = useGetDown();
  const date = useGetDate();

  const setFilterModale = useSetFilterOpen();
  const setSearchResultSort = useSetSearchResultSort();
  const getSearchResultSort = useGetSearchResultSort();

  const copiedDate = new Date(date.rawDate);
  copiedDate.setDate(copiedDate.getDate() + date.plusDays);

  const sortHandler = (type) => {
    if (type === 'price') {
      setSearchResultSort({
        price: {
          active: true,
          dir: getSearchResultSort.price.dir === 'asc' ? 'desc' : 'asc',
        },
        rating: { active: false, dir: getSearchResultSort.rating.dir },
      });
      // { price: false, rating: false }
    }
    if (type === 'rating') {
      setSearchResultSort({
        price: { active: false, dir: getSearchResultSort.price.dir },
        rating: {
          active: true,
          dir: getSearchResultSort.rating.dir === 'asc' ? 'desc' : 'asc',
        },
      });
    }
  };

  const filtersIsActive = () => {
    // add to store
    const currentURL = window.location.href;
    const newURL = new URL(currentURL);
    if (
      newURL.searchParams.get('stars') ||
      newURL.searchParams.get('food') ||
      newURL.searchParams.get('services')
    ) {
      return true;
    } else if (newURL.searchParams.get('price') !== '0' || newURL.searchParams.get('priceTo') !== '375000') {
      return true;
    }
    return false;
  };

  return (
    <div className={styles.header}>
      <div className={styles.sort_items}>
        <button
          className={
            filtersIsActive() ? `${styles.filter_btn} ${styles.filter_btn_active}` : `${styles.filter_btn}`
          }
          onClick={() => setFilterModale(true)}
        >
          <img
            src="/assets/img/svg/results/filter.svg"
            width={18}
            height={18}
            alt=""
            style={{ marginRight: '10px' }}
          />
          <FM id="result.filter.btn" />
        </button>
        <button
          className={styles.sort_btn}
          onClick={() => sortHandler('price')}
          style={getSearchResultSort.price.active ? { background: 'var(--placeholder)' } : {}}
        >
          <img
            src={
              getSearchResultSort.price.dir === 'asc'
                ? '/assets/img/svg/results/sort-numeric.svg'
                : '/assets/img/svg/results/sort-numeric-desc.svg'
            }
            width={14}
            height={18}
            alt="sort"
          />
          <FM id="result.price_sort.btn" />
        </button>
        <button
          className={styles.sort_btn}
          onClick={() => sortHandler('rating')}
          style={getSearchResultSort.rating.active ? { background: 'var(--placeholder)' } : {}}
        >
          <img
            src={
              getSearchResultSort.rating.dir === 'asc'
                ? '/assets/img/svg/results/sort-numeric.svg'
                : '/assets/img/svg/results/sort-numeric-desc.svg'
            }
            width={14}
            height={18}
            alt="sort"
          />
          <FM id="result.rating_sort.btn" />
        </button>
      </div>
      <div className={styles.search_item}>
        <div
          className={styles.search_item_img}
          style={
            down.code.district
              ? {
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '43px',
                  background: 'linear-gradient(95.77deg, #006bd6 -23.84%, #0080ff 145.99%)',
                  borderRadius: 'var(--def-radius)',
                }
              : {}
          }
        >
          <img
            src={down.code.district ? '/assets/img/svg/search_suggests/map-marker.svg' : down.code.img}
            alt=""
            width={down.code.district ? '26' : '60'}
            height={down.code.district ? '26' : '43'}
          />
        </div>
        <div className={`${styles.search_item_name}`}>{down.name[loc] ? down.name[loc] : down.name}</div>
        <div className={styles.search_item_dates}>
          {date.rawDate.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'numeric',
          })}{' '}
          -{' '}
          {copiedDate.toLocaleDateString('uk-UA', {
            day: 'numeric',
            month: 'numeric',
          })}
        </div>
      </div>
    </div>
  );
}
