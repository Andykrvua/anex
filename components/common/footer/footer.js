import styles from './footer.module.css';
import { links } from 'utils/links';
import Link from 'next/link';
import MessendgersLinks from 'components/common/other/messendgersLinks';
import { FormattedMessage as FM } from 'react-intl';

export default function Footer() {
  return (
    <footer className={`${styles.footer} footer`}>
      <div className={styles.tg_banner_wrapper}>
        <div className="container">
          <div className={styles.tg_banner}>
            <div className={styles.tg_banner_texts}>
              <h5 className={styles.tg_banner_texts_title}>Бажаєте отримувати найкращі добірки турів?</h5>
              <p className={styles.tg_banner_texts_desc}>
                Ретельно підбираємо для Вас лише найцікавіші пропозиції та публікуємо їх у нашому
                телеграм-каналі
              </p>
              <p className={styles.tg_banner_texts_subtitle}>Тільки корисна інформація — без зайвого шуму!</p>
              <a href={links.telegram_banner} className={styles.tg_banner_link}>
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9.41718 15.1809L9.02018 20.7649C9.58818 20.7649 9.83418 20.5209 10.1292 20.2279L12.7922 17.6829L18.3102 21.7239C19.3222 22.2879 20.0352 21.9909 20.3082 20.7929L23.9302 3.82092L23.9312 3.81992C24.2522 2.32392 23.3902 1.73892 22.4042 2.10592L1.11418 10.2569C-0.338822 10.8209 -0.316822 11.6309 0.867178 11.9979L6.31018 13.6909L18.9532 5.77992C19.5482 5.38592 20.0892 5.60392 19.6442 5.99792L9.41718 15.1809Z"
                    fill="white"
                  />
                </svg>
                Приєднатися
              </a>
              <img
                className={styles.tg_banner_img_mobile}
                src="/assets/img/tg_banner_fly.webp"
                width={55}
                height={55}
                aria-hidden="true"
              />
            </div>
            <img
              className={styles.tg_banner_img}
              src="/assets/img/tg_banner.webp"
              width={473}
              height={303}
              alt="Telegram канал anex_ua"
            />
          </div>
        </div>
      </div>
      <div className={`${styles.footer_container} container`}>
        <div className={styles.wrapper}>
          <div className={styles.two_col_wrapper}>
            <div className={styles.nav}>
              <h4 className={styles.title}>
                <FM id="footer.t1" />
              </h4>
              <ul className={styles.list}>
                <li>
                  <Link href={links.main}>
                    <a>
                      <FM id="nav.main" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={links.tours}>
                    <a>
                      <FM id="nav.tour" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={`${links.tours}${links.toursBus}`}>
                    <a>
                      <FM id="nav.tour.bus" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={`${links.tours}${links.toursHot}`}>
                    <a>
                      <FM id="nav.tour.hot" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={links.countries}>
                    <a>
                      <FM id="nav.country" />
                    </a>
                  </Link>
                </li>
                {/* <li>
                  <Link href={links.hotTours}>
                    <a>
                      <FM id="nav.hot_tour" />
                    </a>
                  </Link>
                </li> */}
                {/* <li>
                  <Link href={links.hotels}>
                    <a>
                      <FM id="nav.hotels" />
                    </a>
                  </Link>
                </li> */}
                <li>
                  <Link href={links.blog}>
                    <a>
                      <FM id="nav.blog" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={links.faq}>
                    <a>
                      <FM id="nav.faq" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={links.reviews}>
                    <a>
                      <FM id="nav.review" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={links.certificates}>
                    <a>
                      <FM id="nav.certificates" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={links.contacts}>
                    <a>
                      <FM id="nav.contacts" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href={links.privacy_policy}>
                    <a>
                      <FM id="nav.privacy_policy" />
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
            <div className={styles.tours}>
              <h4 className={styles.title}>
                <FM id="footer.t2" />
              </h4>
              <ul className={styles.list}>
                <li>
                  <Link href="/countries/turkey/">
                    <a>
                      <FM id="footer.links.poptour.Turkey" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/countries/egypt/">
                    <a>
                      <FM id="footer.links.poptour.Egipet" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/countries/egypt/tur-hurgada/">
                    <a>
                      <FM id="footer.links.poptour.Hurgada" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/countries/egypt/tur_sharm_el_sheyh/">
                    <a>
                      <FM id="footer.links.poptour.SharmElShaysh" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/countries/bulgaria/">
                    <a>
                      <FM id="footer.links.poptour.Bulgaria" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/countries/spain/">
                    <a>
                      <FM id="footer.links.poptour.Spain" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/countries/montenegro/">
                    <a>
                      <FM id="footer.links.poptour.Montenegro" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/countries/dominician-republic/">
                    <a>
                      <FM id="footer.links.poptour.Dominikana" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/countries/maldives/">
                    <a>
                      <FM id="footer.links.poptour.Maldives" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/countries/uae/">
                    <a>
                      <FM id="footer.links.poptour.OAE" />
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/countries/tanzania/tur-zanzibar/">
                    <a>
                      <FM id="footer.links.poptour.Zanzibar" />
                    </a>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className={styles.contacts}>
            <h4 className={styles.title}>
              <FM id="footer.t3" />
            </h4>
            <ul className={styles.list}>
              <li>
                <FM id="vs_discl" />
                <br />
                <FM id="vs_discl2" />
              </li>
              <li>
                Пн - Пт: 10:00 – 19:00
                <br />
                Сб: 11:00 – 16:00
              </li>
              <li>
                <FM id="footer.address" />
              </li>
              <li>
                <a href="tel:+380443384144">+38 044 338 41 44</a>
              </li>
              <li>
                <a href="tel:+380665914144">+38 066 591 41 44</a>
              </li>
              <li>
                <a href="tel:+380965914144">+38 096 591 41 44</a>
              </li>
              <li>
                <a href="tel:+380635914144 ">+38 063 591 41 44 </a>
              </li>
              <li>
                <a href="mailto:agency@anex-tour.com.ua">agency@anex-tour.com.ua</a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.copyright}>
          {/* <MessendgersLinks /> */}
          <p>
            © 2025 <FM id="footer.copyright" />
          </p>
        </div>
      </div>
    </footer>
  );
}
