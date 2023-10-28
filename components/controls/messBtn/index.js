import styles from './index.module.css';
import { links } from 'utils/links';
import { useState, useEffect } from 'react';
import { FormattedMessage as FM } from 'react-intl';

export default function MessBtn() {
  const [isShow, setIsShow] = useState(false);
  const [_, setSeconds] = useState(0);
  const [change, setChange] = useState(false);

  const toogleShow = () => setIsShow((prev) => !prev);
  const toogleBtnContent = () => setChange((prev) => !prev);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((seconds) => seconds + 1);
      toogleBtnContent();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={isShow ? `${styles.mess_wrapper} ${styles.show}` : `${styles.mess_wrapper}`}>
      <button className={styles.mess_btn} onClick={toogleShow}>
        <span className={styles.text} style={change ? { transform: 'translateY(0)' } : {}}>
          <FM id="chat.btn.txt" />
        </span>
        <span className={styles.icon} style={change ? { transform: 'translateY(100px)' } : {}}>
          <img src="/assets/img/svg/chat.svg" width="24" height="24" alt="" />
        </span>
      </button>
      <a className={styles.link} href={links.telegram}>
        <img src="/assets/img/svg/telegram.svg" alt="Telegram" width="37" height="37" />
      </a>
      <a className={styles.link} href={links.viber}>
        <img src="/assets/img/svg/viber.svg" alt="Viber" width="37" height="37" />
      </a>
    </div>
  );
}
