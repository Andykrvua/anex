import styles from './breadcrumbs.module.css';
import Link from 'next/link';
import { links } from 'utils/links';
import { FormattedMessage as FM } from 'react-intl';

const LinkItem = ({ data, ind, length }) => {
  if (ind === length - 1) {
    return (
      <a className={styles.current} aria-current="page">
        {data.title}
      </a>
    );
  } else {
    return (
      <Link href={data.url}>
        <a>{data.title}</a>
      </Link>
    );
  }
};

export default function Breadcrumbs({ data, beforeMainFrom }) {
  return (
    <ul
      className={
        beforeMainFrom
          ? `${styles.breadcrumbs_list} ${styles.mb20}`
          : styles.breadcrumbs_list
      }
    >
      <li>
        <Link href={links.main}>
          <a>
            <FM id="links.main" />
          </a>
        </Link>
      </li>
      {data.map((item, index, arr) => {
        return (
          <li key={index}>
            <LinkItem data={item} ind={index} length={arr.length} />
          </li>
        );
      })}
    </ul>
  );
}
