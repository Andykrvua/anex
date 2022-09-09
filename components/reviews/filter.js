import styles from './filter.module.css';
import Link from 'next/link';

export default function ReviewsFilter() {
  return (
    <div className={styles.filter_wrapper}>
      <Link href={'/vidhuky'}>
        <a className={styles.disabled}>
          <img src="/assets/img/svg/reviews/filter/date.svg" alt="" />
          По дате
        </a>
      </Link>
      <Link href={'/vidhuky?test=true'}>
        <a>
          <img src="/assets/img/svg/reviews/filter/sun.svg" alt="" />
          Сначала с фото
        </a>
      </Link>
    </div>
  );
}
