import { showTime } from 'utils/constants';
import styles from './infoModalLayout.module.css';

export default function InfoModalLayout({ data }) {
  return (
    <div
      className={`${styles.modal_wrapper} ${styles[data.type]} ${data.type}`}
    >
      <p>{data.text}</p>
      <div className={styles.line_wrapper}>
        <div
          className={`${styles.line} ${styles.animation}`}
          style={{ '--animation-time': `${showTime.time}ms` }}
        ></div>
      </div>
    </div>
  );
}
