import styles from './links.module.css';
import { links } from 'utils/links';
import Link from 'next/link';

export default function Links({ allLinks }) {
  return (
    <div className={styles.links_wrapper}>
      {allLinks.map((item, ind) => {
        return (
          <Link key={ind} href={`${links.tours}/${item.slug}`}>
            <a className={styles.links_item}>{item.translations[0].name}</a>
          </Link>
        );
      })}
    </div>
  );
}
