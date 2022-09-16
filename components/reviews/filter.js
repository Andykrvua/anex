import styles from './filter.module.css';
import Link from 'next/link';
import { FormattedMessage as FM } from 'react-intl';

export default function ReviewsFilter({ filter }) {
  return (
    <div className={styles.filter_wrapper}>
      <Link href={'/vidhuky'}>
        <a className={!filter ? styles.disabled : ''}>
          <svg
            className={styles.svg_date}
            width="17"
            height="14"
            viewBox="0 0 17 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect y="6" width="17" height="2" rx="1" />
            <rect y="11" width="17" height="2" rx="1" />
            <rect y="1" width="17" height="2" rx="1" />
            <rect x="3" width="3" height="4" rx="1.5" />
            <rect x="11" y="5" width="3" height="4" rx="1.5" />
            <rect x="3" y="10" width="3" height="4" rx="1.5" />
          </svg>
          <FM id="filter.date" />
        </a>
      </Link>
      <Link href={'/vidhuky?f=img'}>
        <a className={filter ? styles.disabled : ''}>
          <svg
            className={styles.svg_img}
            width="20"
            height="19"
            viewBox="0 0 20 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1 13C3.483 13 5.345 10 5.345 10C5.345 10 7.207 13 9.69 13C12.172 13 14.655 10 14.655 10C14.655 10 17.138 13 19 13"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 18C3.483 18 5.345 15 5.345 15C5.345 15 7.207 18 9.69 18C12.172 18 14.655 15 14.655 15C14.655 15 17.138 18 19 18"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M17 8C17 7.08075 16.8189 6.1705 16.4672 5.32122C16.1154 4.47194 15.5998 3.70026 14.9497 3.05025C14.2997 2.40024 13.5281 1.88463 12.6788 1.53284C11.8295 1.18106 10.9193 1 10 1C9.08075 1 8.17049 1.18106 7.32122 1.53284C6.47194 1.88463 5.70026 2.40024 5.05025 3.05025C4.40024 3.70026 3.88463 4.47194 3.53284 5.32122C3.18106 6.1705 3 7.08075 3 8"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <FM id="filter.img" />
        </a>
      </Link>
    </div>
  );
}
