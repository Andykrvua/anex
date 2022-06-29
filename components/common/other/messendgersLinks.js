import styles from './messendgersLinks.module.css';
import { links } from 'utils/links';

export default function MessendjersLinks() {
  return (
    <>
      <a className={styles.messendgerslinks} href={links.telegram}>
        <img
          src="/assets/img/svg/telegram.svg"
          alt="Telegram"
          width="37"
          height="37"
        />
      </a>
      <a className={styles.messendgerslinks} href={links.viber}>
        <img
          src="/assets/img/svg/viber.svg"
          alt="Viber"
          width="37"
          height="37"
        />
      </a>
    </>
  );
}
