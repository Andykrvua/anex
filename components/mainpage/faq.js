import Accordion from 'components/common/accordion/accordion';
import styles from './faq.module.css';
import { accordionData } from 'utils/data/accordionData';

export default function Faq() {
  return (
    <div className={styles.faq}>
      <h3 className={styles.faq_title}>Вопрос-ответ</h3>
      <Accordion data={accordionData} />
    </div>
  );
}
