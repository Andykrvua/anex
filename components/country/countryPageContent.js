import styles from './countryPageContent.module.css';
import TourList from 'components/country/tourList';
import DistrictList from 'components/country/districtList';
import CountryPostContent from 'components/blog/post';
import { location } from 'utils/constants';
import CountryToursFrom from 'components/country/countryToursFrom';
import CountryToursMonth from 'components/country/countryToursMonth';
import { useIntl } from 'react-intl';

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

const SubpagesLinks = ({ subpagesSlugs, countryName, current = 0 }) => {
  const intl = useIntl();
  const from = subpagesSlugs.filter(
    (item) => item.temp_from === null && item?.is_district !== true
  );

  const month = subpagesSlugs.filter((item) => item.temp_from !== null);
  return (
    <>
      {from.length ? (
        <>
          <h2 className={`${styles.subtitle} block_title`}>
            {intl.formatMessage({ id: 'country.from_1' })}
            <span className="mark">{countryName}</span>
            {intl.formatMessage({ id: 'country.from_2' })}
          </h2>
          <CountryToursFrom data={from} current={current} />
        </>
      ) : null}
      {month.length ? (
        <>
          <h2 className={`${styles.subtitle} block_title`}>
            {intl.formatMessage({ id: 'country.month_1' })}
            <span className="mark">{countryName}</span>
            {intl.formatMessage({ id: 'country.month_2' })}
          </h2>
          <CountryToursMonth data={month} current={current} />
        </>
      ) : null}
    </>
  );
};

export default function CountryPageContent({ country, loc, subpagesSlugs }) {
  return (
    <section className={styles.page_wrapper}>
      {country?.translations[0].declension_title && (
        <h2 className={styles.title}>
          {country?.translations[0].declension_title}
        </h2>
      )}
      {country.translations[0].property_list && (
        <CountryPropertys country={country} />
      )}
      {country.code &&
      subpagesSlugs.filter((item) => item.is_district === true).length ? (
        <DistrictList
          data={subpagesSlugs.filter((item) => item.subsubpage !== true)}
          title={country.translations[0].country_district_title}
          country={country.slug}
          loc={loc}
        />
      ) : null}
      <TourBlock code={country.code} />
      {country?.translations[0].post_title && (
        <CountryPostContent
          post={country}
          loc={loc}
          variant={location.postContent.countryPage}
        />
      )}
      {subpagesSlugs.length > 0 && (
        <SubpagesLinks
          current={country?.subpage_slug}
          subpagesSlugs={subpagesSlugs}
          countryName={country.translations[0].from_month_country_name}
        />
      )}
    </section>
  );
}
