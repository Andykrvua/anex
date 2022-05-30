import Accordion from 'components/common/accordion/accordion';
import styles from './faq.module.css';
import { links } from 'utils/links';

import Link from 'next/link';
import { FormattedMessage as FM } from 'react-intl';

export default function Faq({ data }) {
  return (
    <div className={styles.faq}>
      <h3 className={`${styles.title} block_title`}>
        <FM id="faq.title" />
      </h3>
      <Accordion data={data} />
      <div className={styles.link_wrapper}>
        <Link href={links.faq}>
          <a className={styles.link}>
            <FM id="faq.link_a" />
            {data.length}
            <FM id="faq.link_b" />
          </a>
        </Link>
      </div>
    </div>
  );
}
