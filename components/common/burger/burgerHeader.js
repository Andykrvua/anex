import styles from './burgerHeader.module.css';
import CloseSvg from '../closeSvg';
import Logo from '../header/logo';
import { location } from 'utils/constants';

export default function BurgerHeader({ closeBurgerHandler, logo = null }) {
  return (
    <header className={styles.burger_header}>
      <button
        className={`svg_btn ${styles.burger_close} ${styles.svg_btn}  `}
        aria-label="Закрыть"
        onClick={closeBurgerHandler}
      >
        <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M30 22a1 1 0 1 0 0-2v2Zm-18.707-1.707a1 1 0 0 0 0 1.414l6.364 6.364a1 1 0 0 0 1.414-1.414L13.414 21l5.657-5.657a1 1 0 0 0-1.414-1.414l-6.364 6.364ZM30 20H12v2h18v-2Z" />
        </svg>
      </button>
      <Logo logo={logo} location={location.logo.burger} closeBurgerHandler={closeBurgerHandler} />
      <button
        className={`svg_btn svg_btn_stroke ${styles.burger_close_not_mobile}  ${styles.svg_btn}`}
        aria-label="Закрыть"
        onClick={closeBurgerHandler}
      >
        <CloseSvg />
      </button>
    </header>
  );
}
