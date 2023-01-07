import { useSetFilterOpen } from 'store/store';
import { FormattedMessage as FM } from 'react-intl';
import styles from './searchHeader.module.css';
import { useRouter } from 'next/router';
import { useGetDown, useGetDate } from 'store/store';

export default function SearchHeader() {
  const router = useRouter();
  const loc = router.locale;

  const down = useGetDown();
  const date = useGetDate();

  const setFilterModale = useSetFilterOpen();

  const copiedDate = new Date(date.rawDate);
  copiedDate.setDate(copiedDate.getDate() + date.plusDays);

  return (
    <div className={styles.header}>
      <div className={styles.sort_items}>
        <button
          className={styles.filter_btn}
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
        <button className={styles.sort_btn}>
          <img
            src="/assets/img/svg/results/sort-numeric.svg"
            width={14}
            height={18}
            alt=""
          />
          {/* <img
            src="/assets/img/svg/results/sort-numeric-desc.svg"
            width={14}
            height={18}
            alt=""
          /> */}
          <FM id="result.sort.btn" />
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
                  background:
                    'linear-gradient(95.77deg, #006bd6 -23.84%, #0080ff 145.99%)',
                  borderRadius: 'var(--def-radius)',
                }
              : {}
          }
        >
          <img
            src={
              down.code.district
                ? '/assets/img/svg/search_suggests/map-marker.svg'
                : down.code.img
            }
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
  );
}
