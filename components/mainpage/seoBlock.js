import styles from './seoBlock.module.css';
import { FormattedMessage as FM } from 'react-intl';

export default function SeoBlock() {
  return (
    <div className={styles.seoblock}>
      <h3 className={`${styles.title} block_title`}>
        <FM id="main.seo.title_a" />
        <span className={styles.title_mark}>
          <FM id="main.seo.title_b" />
        </span>
        <FM id="main.seo.title_c" />
      </h3>
      <p className="prg">
        Уважаемые туристы, рады приветствовать Вас на сайте турагентства АНЕКС
        Тур Украина. Мы являемся официальным офисом продаж от туроператора ANEX
        Tour.
      </p>
      <p className="prg">
        В нашем агентстве Вы можете забронировать тур онлайн или обратится по
        адресу: Киев, ул. Васильковская 32.
      </p>
      <p className="prg">
        Уважаемые туристы, рады приветствовать Вас на сайте турагентства АНЕКС
        Тур Украина. Мы являемся официальным офисом продаж от туроператора ANEX
        Tour.
      </p>
      <p className="prg">
        В нашем агентстве Вы можете забронировать тур онлайн или обратится по
        адресу: Киев, ул. Васильковская 32.
      </p>
      <p className="prg">
        Уважаемые туристы, рады приветствовать Вас на сайте турагентства АНЕКС
        Тур Украина. Мы являемся официальным офисом продаж от туроператора ANEX
        Tour.
      </p>
      <p className="prg">
        В нашем агентстве Вы можете забронировать тур онлайн или обратится по
        адресу: Киев, ул. Васильковская 32.
      </p>
    </div>
  );
}
