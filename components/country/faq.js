import Accordion from 'components/common/accordion/accordion';
import styles from './faq.module.css';
import { FormattedMessage as FM } from 'react-intl';

export default function Faq({ data }) {
  return (
    <div className={styles.faq}>
      <h3 className={`${styles.title} block_title`}>
        <FM id="faq.title" />
      </h3>
      <Accordion data={data} />
    </div>
  );
}
