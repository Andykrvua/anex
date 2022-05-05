import { useState, useEffect } from 'react';
import styles from './burger.module.css';
import { useSetBurger, useGetBurger } from 'store/store';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';
import BurgerHeader from './burgerHeader';
import Link from 'next/link';
import SwitchMenu from '/components/common/switchMenu/switchMenu.js';
import { useRouter } from 'next/router';

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
                <a className={styles.burger_nav_link}>Главная</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>Туры</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>Страны</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>Горящие туры</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>Блог</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>Отзывы</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>Сертификаты</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className={styles.burger_nav_link}>Контакты</a>
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
                callback={setLang}
              />
            </div>
            <div>2</div>
            <div>3</div>
          </div>
        </div>
      </div>
    </div>
  );
}
