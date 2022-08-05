import styles from './countryToursFrom.module.css';
import Link from 'next/link';
import { FormattedMessage as FM } from 'react-intl';
import { links } from 'utils/links';

export default function CountryToursFrom({ data }) {
  return (
    <div className={styles.toursfrom_items}>
      {data.map((item, ind) => (
        <Link
          href={`${links.countries}/${item.country_slug.slug}/${item.subpage_slug}`}
          key={ind}
        >
          <a className={`${styles.toursfrom_item} touch`}>
            <span className={styles.toursfrom_item_img_wrapper}>
              <svg
                width="20"
                height="16"
                viewBox="0 0 20 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M1 14h18v2H1v-2ZM19.4 3.7a1.607 1.607 0 0 0-2-1l-5.8 1.5-5-3.7-1 .6 2.4 4-5 1.3-1.9-1.7-1 .2 2.3 4.7 15.7-4.1a1.464 1.464 0 0 0 1.3-1.8Z" />
              </svg>
            </span>
            <span className={styles.toursfrom_item_text}>
              <span className={styles.toursfrom_item_text_descr}>
                <FM id="country.tours_from" />
              </span>
              <span className={styles.toursfrom_item_text_title}>
                <FM id={`country.${item.subpage_slug}`} />
              </span>
            </span>
          </a>
        </Link>
      ))}
    </div>
  );
}
