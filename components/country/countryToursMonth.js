import styles from './countryToursMonth.module.css';
import Link from 'next/link';
import { FormattedMessage as FM } from 'react-intl';
import { links } from 'utils/links';

const colors = {
  january: '#4dc2f6',
  february: '#4dc2f6',
  march: '#80c683',
  april: '#80c683',
  may: '#80c683',
  june: '#ffb54b',
  july: '#ffb54b',
  august: '#ffb54b',
  september: '#f37572',
  october: '#f37572',
  november: '#f37572',
  december: '#4dc2f6',
};

const AContent = ({ item, current }) => {
  return (
    <>
      <span
        className={
          item.subpage_slug !== current
            ? `${styles.toursmonth_item_title}`
            : `${styles.toursmonth_item_title} ${styles.toursmonth_item_title__current}`
        }
      >
        <FM id={`month.${item.subpage_slug}`} />
      </span>
      <span className={styles.toursmonth_temp}>
        <span className={styles.toursmonth_temp_img_wrapper}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 12H2M12 18C13.5913 18 15.1174 17.3679 16.2426 16.2426C17.3679 15.1174 18 13.5913 18 12C18 10.4087 17.3679 8.88258 16.2426 7.75736C15.1174 6.63214 13.5913 6 12 6C10.4087 6 8.88258 6.63214 7.75736 7.75736C6.63214 8.88258 6 10.4087 6 12C6 13.5913 6.63214 15.1174 7.75736 16.2426C8.88258 17.3679 10.4087 18 12 18V18ZM22 12H23H22ZM12 2V1V2ZM12 23V22V23ZM20 20L19 19L20 20ZM20 4L19 5L20 4ZM4 20L5 19L4 20ZM4 4L5 5L4 4Z"
              stroke={colors[item.subpage_slug]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {item.temp_from}°
      </span>
      <span className={styles.toursmonth_temp}>
        <span className={styles.toursmonth_temp_img_wrapper}>
          <svg width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 13C3.483 13 5.345 10 5.345 10C5.345 10 7.207 13 9.69 13C12.172 13 14.655 10 14.655 10C14.655 10 17.138 13 19 13"
              stroke={colors[item.subpage_slug]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 18C3.483 18 5.345 15 5.345 15C5.345 15 7.207 18 9.69 18C12.172 18 14.655 15 14.655 15C14.655 15 17.138 18 19 18"
              stroke={colors[item.subpage_slug]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 8C17 7.08075 16.8189 6.1705 16.4672 5.32122C16.1154 4.47194 15.5998 3.70026 14.9497 3.05025C14.2997 2.40024 13.5281 1.88463 12.6788 1.53284C11.8295 1.18106 10.9193 1 10 1C9.08075 1 8.17049 1.18106 7.32122 1.53284C6.47194 1.88463 5.70026 2.40024 5.05025 3.05025C4.40024 3.70026 3.88463 4.47194 3.53284 5.32122C3.18106 6.1705 3 7.08075 3 8"
              stroke={colors[item.subpage_slug]}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        {item.temp_to}°
      </span>
    </>
  );
};

export default function CountryToursMonth({ data, current }) {
  return (
    <div className={styles.toursmonth_items}>
      {data.map((item, ind) => {
        if (item.subpage_slug === current) {
          return (
            <a
              key={ind}
              className={
                item.subpage_slug !== current
                  ? `${styles.toursmonth_item} touch`
                  : `${styles.toursmonth_item} ${styles.toursmonth_item__current} touch`
              }
            >
              <AContent item={item} current={current} />
            </a>
          );
        } else {
          return (
            <Link href={`${links.countries}/${item.country_slug.slug}/${item.subpage_slug}`} key={ind}>
              <a
                className={
                  item.subpage_slug !== current
                    ? `${styles.toursmonth_item} touch`
                    : `${styles.toursmonth_item} ${styles.toursmonth_item__current} touch`
                }
              >
                <AContent item={item} current={current} />
              </a>
            </Link>
          );
        }
      })}
    </div>
  );
}
