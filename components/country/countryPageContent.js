import styles from './countryPageContent.module.css';
import TourList from 'components/country/tourList';
import CountryPostContent from 'components/blog/post';
import { location } from 'utils/constants';

const CountryPropertys = ({ country }) => {
  return (
    <div className={styles.property_wrapper}>
      <div className={styles.property_item}>
        <img
          src={`/assets/img/svg/flags/${country.code}.svg`}
          width="85"
          height="62"
          alt=""
        />
      </div>
      {country.translations[0].property_list.map((item) => {
        return (
          <div className={styles.property_item} key={item.title}>
            <p className={styles.property_item_title}>{item.title}</p>
            <p className={styles.property_item_value}>{item.value}</p>
          </div>
        );
      })}
    </div>
  );
};

const TourBlock = ({ code }) => {
  return (
    <div className={styles.orders_wrapper}>
      <TourList />
    </div>
  );
};

export default function CountryPageContent({ country, loc }) {
  return (
    <section className={styles.page_wrapper}>
      <h2 className={styles.title}>
        {country?.translations[0].declension_title}
      </h2>
      {country.translations[0].property_list && (
        <CountryPropertys country={country} />
      )}
      <TourBlock code={country.code} />
      <CountryPostContent
        post={country}
        loc={loc}
        variant={location.postContent.countryPage}
      />
    </section>
  );
}
