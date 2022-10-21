import { useState } from 'react';
import styles from './accordion.module.css';

export default function Accordion({ title, open = false, children }) {
  const [check, setCheck] = useState(open);

  return (
    <div className={styles.accordion_wrapper}>
      <h4
        className={styles.filter_parts_title}
        onClick={() => setCheck((prev) => !prev)}
      >
        {title}
        <img
          className={
            check
              ? `${styles.dropdown_icon} ${styles.dropdown_icon_open}`
              : `${styles.dropdown_icon}`
          }
          src="/assets/img/svg/results/dropdown.svg"
          alt=""
        />
      </h4>
      <div
        className={
          check
            ? `${styles.text_content} ${styles.open}`
            : `${styles.text_content}`
        }
      >
        {children}
      </div>
    </div>
  );
}
