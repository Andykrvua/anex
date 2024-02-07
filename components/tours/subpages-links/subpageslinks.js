import styles from './subpageslinks.module.css';
import { links } from 'utils/links';
import Link from 'next/link';
import { useIntl } from 'react-intl';
import { FormattedMessage as FM } from 'react-intl';
import { useRouter } from 'next/router';

export default function Links({ allLinks, title, current, level }) {
  const intl = useIntl();
  const router = useRouter();

  return (
    <>
      <h2 className={`${styles.subtitle} block_title`}>
        <span className="mark">{title}</span>
        {intl.formatMessage({ id: 'country.from_2' })}
      </h2>
      <div className={styles.toursfrom_items}>
        {allLinks.map((item, ind) => {
          if (level === 2 && item.subpage === router.query.subpage) {
            return (
              <a className={`${styles.toursfrom_item} touch`} key={ind}>
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
                    <FM id="country.tours_from" /> &nbsp;
                  </span>
                  <span className={styles.toursfrom_item_text_title}>{item.translations[0].name}</span>
                </span>
              </a>
            );
          } else {
            return (
              <Link href={`${links.tours}/${item.slug}/${item.subpage}/`} key={ind}>
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
                      <FM id="country.tours_from" /> &nbsp;
                    </span>
                    <span className={styles.toursfrom_item_text_title}>{item.translations[0].name}</span>
                  </span>
                </a>
              </Link>
            );
          }
        })}
      </div>
    </>
  );
}
