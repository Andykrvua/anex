import styles from './footer.module.css';
import { links } from 'utils/links';
import Link from 'next/link';
import MessendgersLinks from 'components/common/other/messendgersLinks';
import { FormattedMessage as FM } from 'react-intl';

export default function Footer() {
  return (
    <footer className={`${styles.footer} footer`}>
      <div className="container">
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
                  <Link href="/countries/turkey/">
                    <a>
                      <FM id="footer.links.poptour.Turkey" />
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
                  <Link href="/countries/meksika/">
                    <a>
                      <FM id="footer.links.poptour.Mexico" />
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
              </ul>
            </div>
          </div>
          <div className={styles.contacts}>
            <h4 className={styles.title}>
              <FM id="footer.t3" />
            </h4>
            <ul className={styles.list}>
              <li><FM id="vs_discl" /><br/><FM id="vs_discl2" /></li>
              <li>Пн - Пт: 11:00 – 19:00<br/>Сб: 11:00 – 17:00</li>
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
                <a href="mailto:agency@anex-tour.com.ua">
                  agency@anex-tour.com.ua
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className={styles.copyright}>
          <MessendgersLinks />
          <p>
            © 2023 <FM id="footer.copyright" />
            {/* <span>Все права защищены</span> */}
          </p>
        </div>
      </div>
    </footer>
  );
}
