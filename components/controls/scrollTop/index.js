import useScroll from 'utils/useScroll';
import { isBrowser } from 'utils/utils';
import styles from './index.module.css';

export default function ScrollTop() {
  const scrollPosition = useScroll();
  const showBtnPosition = 1000;

  function scrollToTop() {
    if (isBrowser()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  return (
    <button
      className={
        scrollPosition > showBtnPosition
          ? `${styles.scrolltop_btn} ${styles.show}`
          : styles.scrolltop_btn
      }
      onClick={scrollToTop}
    >
      <span></span>
    </button>
  );
}
