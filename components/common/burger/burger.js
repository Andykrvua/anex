import { useState, useEffect } from 'react';
import styles from './burger.module.css';
import { useSetBurger, useGetBurger, useSetModal } from 'store/store';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';
import BurgerHeader from './burgerHeader';
import Link from 'next/link';
import SwitchMenu from '/components/common/switchMenu/switchMenu.js';
import { useRouter } from 'next/router';
import { FormattedMessage as FM } from 'react-intl';
import { links } from 'utils/links';
import MessendgersLinks from 'components/common/other/messendgersLinks';
import { modal } from 'utils/constants';

export default function Burger() {
  const setBurger = useSetBurger();
  const getBurger = useGetBurger();
  const setModal = useSetModal();

  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState(locale);
  const [offsetTop, setOffsetTop] = useState(0);

  useEffect(() => {
    if (locale === lang) {
      return;
    }
    router.push({ pathname, query }, asPath, { locale: lang });
  }, [lang]);

  useEffect(() => {
    if (getBurger) {
      router.events.on('routeChangeComplete', () => closeBurgerHandler('changeRoute'));
    }
    return () => {
      router.events.off('routeChangeComplete');
    };
  }, [router.events, getBurger]);

  useEffect(() => {
    const BODY = document.querySelector('body');
    const SCROLLABLE = document.querySelector('.burger_content_wrapper');
    if (getBurger) {
      BODY.style.top = `-${window.scrollY}px`;
      setOffsetTop(window.scrollY);
      setIsOpen(true);
      lock(BODY);
      unlock(SCROLLABLE);
      BODY.classList.add('iosfix');
    } else {
      BODY.classList.remove('iosfix');
      BODY.style.top = '0px';
      if (offsetTop) {
        window.scrollTo({
          top: getBurger === undefined ? 0 : offsetTop,
        });
        setOffsetTop(0);
      }
      clearBodyLocks();
      setIsOpen(false);
    }
  }, [getBurger]);

  const closeBurgerHandler = (val) => {
    if (val === 'changeRoute') {
      setBurger(undefined);
    } else {
      setBurger(false);
    }
  };

  const pickTourHandler = () => {
    setBurger(false);
    setModal({ get: modal.leadGetTours });
  };

  const closeBurgerOverlayHandler = (e) => {
    if (e.target.classList.contains('burger_overlay')) {
      setBurger(false);
    }
  };

  return (
    <div
      className={
        isOpen
          ? `${styles.burger_overlay} ${styles.open} burger_overlay open`
          : `${styles.burger_overlay} burger_overlay`
      }
      onClick={(e) => closeBurgerOverlayHandler(e)}
    >
      {/* fix blinking reload */}
      <style jsx>{`
        .burger_overlay {
          transform: translateX(-100%);
        }
        .burger_overlay.open {
          transform: translateX(0);
        }
      `}</style>

      <div className={styles.burger} style={{ top: offsetTop }}>
        <BurgerHeader closeBurgerHandler={closeBurgerHandler} />
        <div className={`${styles.burger_content_wrapper} burger_content_wrapper`}>
          <ul className={styles.burger_nav}>
            <li>
              <Link href={links.main}>
                <a className={styles.burger_nav_link}>
                  <FM id="main" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={links.tours}>
                <a className={styles.burger_nav_link}>
                  <FM id="nav.tour" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={links.countries}>
                <a className={styles.burger_nav_link}>
                  <FM id="nav.country" />
                </a>
              </Link>
            </li>
            {/* <li>
              <Link href={links.tours}>
                <a className={`${styles.burger_nav_link} ${styles.hot}`}>
                  <FM id="nav.hot_tour" />
                </a>
              </Link>
            </li> */}
            <li>
              <Link href={links.blog}>
                <a className={styles.burger_nav_link}>
                  <FM id="nav.blog" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={links.faq}>
                <a className={styles.burger_nav_link}>
                  <FM id="nav.faq" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={links.reviews}>
                <a className={styles.burger_nav_link}>
                  <FM id="nav.review" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={links.certificates}>
                <a className={styles.burger_nav_link}>
                  <FM id="nav.certificates" />
                </a>
              </Link>
            </li>
            <li>
              <Link href={links.contacts}>
                <a className={styles.burger_nav_link}>
                  <FM id="nav.contacts" />
                </a>
              </Link>
            </li>
          </ul>
          <div className={styles.right_column}>
            <div>
              <SwitchMenu
                items={[
                  { name: 'RU', value: 'ru' },
                  { name: 'UA', value: 'uk' },
                ]}
                name={'lang_switcher'}
                callback={[lang, setLang]}
              />
            </div>
            <div>
              <button className={styles.circle_btn} onClick={() => pickTourHandler()}>
                <FM id="nav.pick_tour" />
              </button>
            </div>
            <div className={styles.burger_messendger}>{/* <MessendgersLinks /> */}</div>
          </div>
          <p className={styles.buregr_copyright}>
            © 2023 <FM id="nav.copyright" />
          </p>
        </div>
      </div>
    </div>
  );
}
