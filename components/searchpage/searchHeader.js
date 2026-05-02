import { FormattedMessage as FM } from 'react-intl';
import { useRouter } from 'next/router';
import {
  useGetDown,
  useGetDate,
  useSetFilterOpen,
  useGetInitialDate,
  useGetToCitiesNames,
} from 'store/store';
import { getDateRangeEndDate } from 'utils/dateRange';
import styles from './searchHeader.module.css';

// v2 заменил legacy sort кнопки (price/rating, useSearchResultSort) на
// собственный <SortToggle /> в `v2/controls/`. Здесь оставлен только
// filter-trigger + destination/dates блок — общая шапка над списком.

export default function SearchHeader() {
  const router = useRouter();
  const loc = router.locale;

  const down = useGetDown();
  const date = useGetDate();
  const setFilterModale = useSetFilterOpen();
  const initialDate = useGetInitialDate();
  const copiedDate = getDateRangeEndDate(date, initialDate);
  const toCitiesNames = useGetToCitiesNames();

  const filtersIsActive = () => {
    if (typeof window === 'undefined') return false;
    const newURL = new URL(window.location.href);
    if (
      newURL.searchParams.get('stars') ||
      newURL.searchParams.get('food') ||
      newURL.searchParams.get('services')
    ) {
      return true;
    }
    if (
      newURL.searchParams.get('price') !== '0' ||
      newURL.searchParams.get('priceTo') !== '375000'
    ) {
      return true;
    }
    return false;
  };

  return (
    <>
      <div className={styles.header}>
        <div className={styles.sort_items}>
          <button
            className={
              filtersIsActive()
                ? `${styles.filter_btn} ${styles.filter_btn_active}`
                : `${styles.filter_btn}`
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
          <div className={`${styles.search_item_name}`}>
            {down.name[loc] ? down.name[loc] : down.name}
          </div>
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
      {toCitiesNames.length > 0 && (
        <div className={styles.search_item_resorts}>
          <span className={styles.search_item_resorts_label}>
            <FM id="result.search_by_resorts" />
          </span>{' '}
          {toCitiesNames.join(', ')}
        </div>
      )}
    </>
  );
}
