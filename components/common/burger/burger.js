import { useState, useEffect } from 'react';
import styles from './burger.module.css';
import { useSetBurger, useGetBurger } from 'store/store';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';
import BurgerHeader from './burgerHeader';
import Link from 'next/link';
import SwitchMenu from '/components/common/switchMenu/switchMenu.js';
import { useRouter } from 'next/router';
import SvgTelegram from '/components/svgTelegram.js';
import SvgViber from '/components/svgViber.js';
import { FormattedMessage as FM } from 'react-intl';

export default function Burger() {
  const setBurger = useSetBurger();
  const getBurger = useGetBurger();

  const router = useRouter();
  const { pathname, asPath, query, locale } = router;

  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState(locale);

  useEffect(() => {
    if (locale === lang) {
      return;
    }
    router.push({ pathname, query }, asPath, { locale: lang });
  }, [lang]);

  useEffect(() => {
    const BODY = document.querySelector('body');
    const SCROLLABLE = document.querySelector('.burger_content_wrapper');
    if (getBurger) {
      setIsOpen(true);
      lock(BODY);
      unlock(SCROLLABLE);
      BODY.classList.add('iosfix');
    } else {
      BODY.classList.remove('iosfix');
      clearBodyLocks();
      setIsOpen(false);
    }
  }, [getBurger]);

  const closeBurgerHandler = () => {
    setBurger(false);
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
          ? `${styles.burger_overlay} ${styles.open} burger_overlay`
          : `${styles.burger_overlay}`
      }
      onClick={(e) => closeBurgerOverlayHandler(e)}
    >
      <div className={styles.burger}>
        <BurgerHeader closeBurgerHandler={closeBurgerHandler} />
        <div
          className={`${styles.burger_content_wrapper} burger_content_wrapper`}
        >
          <ul className={styles.burger_nav}>
            <li>
              <Link href="/index2">
                <a className={styles.burger_nav_link}>
                  <FM id="main" />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>
                  <FM id="nav.tour" />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>
                  <FM id="nav.country" />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={`${styles.burger_nav_link} ${styles.hot}`}>
                  <FM id="nav.hot_tour" />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>
                  <FM id="nav.blog" />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>
                  <FM id="nav.review" />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>
                  <FM id="nav.certificates" />
                </a>
              </Link>
            </li>
            <li>
              <Link href="/">
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
              <button className={styles.circle_btn}>
                <FM id="nav.pick_tour" />
              </button>
            </div>
            <div className={styles.burger_messendger}>
              <Link href="/">
                <a>
                  <SvgTelegram />
                </a>
              </Link>

              <Link href="/">
                <a>
                  <SvgViber />
                </a>
              </Link>
            </div>
          </div>
          <p className={styles.buregr_copyright}>
            © 2022 <FM id="nav.copyright" />
          </p>
        </div>
      </div>
    </div>
  );
}
