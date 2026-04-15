import styles from './header.module.css';
import CloseSvg from '../../common/closeSvg';
import BackArrowSvg from '../../common/backArrowSvg';

export default function Header({ closeModalHandler, onBack, svg }) {
  return (
    <header className={styles.popup_header}>
      <button
        className={`${styles.popup_close}  svg_btn`}
        aria-label="Закрыть"
        onClick={onBack || closeModalHandler}
      >
        <BackArrowSvg />
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
