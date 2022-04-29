import styles from './header.module.css';
import CloseSvg from '../../common/closeSvg';

export default function Header({ closeModalHandler, svg }) {
  return (
    <header className={styles.popup_header}>
      <button
        className={`${styles.popup_close}  svg_btn`}
        aria-label="Закрыть"
        onClick={closeModalHandler}
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M30 22a1 1 0 1 0 0-2v2Zm-18.707-1.707a1 1 0 0 0 0 1.414l6.364 6.364a1 1 0 0 0 1.414-1.414L13.414 21l5.657-5.657a1 1 0 0 0-1.414-1.414l-6.364 6.364ZM30 20H12v2h18v-2Z" />
        </svg>
      </button>
      <div
        className={styles.header_label}
        dangerouslySetInnerHTML={{ __html: svg }}
      ></div>
      <button
        className={`${styles.popup_close} ${styles.popup_close_not_mobile} svg_btn svg_btn_stroke`}
        aria-label="Закрыть"
        onClick={closeModalHandler}
      >
        <CloseSvg />
      </button>
    </header>
  );
}
