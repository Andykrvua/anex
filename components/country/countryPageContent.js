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
        <img src={`/assets/img/svg/flags/${country.code}.svg`} width="85" height="62" alt="" />
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

const SubpagesLinks = ({
  subpagesSlugs,
  countryName,
  current = 0,
  subsubpage = null,
  nestingDistrict = null,
  district = null,
}) => {
  const intl = useIntl();
  let from = subpagesSlugs.filter((item) => item.temp_from === null && item?.is_district !== true);
  const month = subpagesSlugs.filter((item) => item.temp_from !== null);

  if (subsubpage && district) {
    from = from.filter((item) => item.subsubpage_slug === current);
  }

  if (subsubpage && !district) {
    from = from.filter((item) => !item.subdistrict_slug);
  }

  if (nestingDistrict && from.length === 1 && from[0].subdistrict_slug === current) {
    return null;
  }
  if (nestingDistrict) {
    from = from.filter((item) => item.subdistrict_slug !== current && item.subdistrict_slug);
  }
  if (from.length === 1 && from[0].subsubpage_slug === current) {
    if (!from[0].subdistrict_slug) {
      return null;
    }
  }

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

export default function CountryPageContent({
  country,
  loc,
  subpagesSlugs,
  isDistrict = false,
  subpageSlug,
  subsubpage,
  minOffer = null,
  subpagesFromCities = null,
  nestingDistrict = null,
}) {
  return (
    <section className={styles.page_wrapper}>
      {country?.translations[0].declension_title && (
        <h2 className={styles.title}>{country?.translations[0].declension_title}</h2>
      )}
      {country.translations[0].property_list && <CountryPropertys country={country} />}
      {subpagesSlugs.filter((item) => item.is_district === true).length &&
      (!subsubpage || (!country.is_district && !nestingDistrict)) ? (
        <DistrictList
          data={
            isDistrict
              ? subpagesSlugs.filter(
                  (item) => item.is_district && item.subsubpage && item.subpage_slug === subpageSlug
                )
              : country.district_from_cities
              ? subpagesSlugs.filter(
                  (item) => item.subpage_slug === country.subpage_slug && item.is_district && item.subsubpage
                )
              : subpagesSlugs.filter((item) => item.is_district && !item.subsubpage)
          }
          title={country.translations[0].country_district_title}
          country={country.slug ? country.slug : country.country_slug.slug}
          loc={loc}
        />
      ) : null}
      {/* <TourBlock code={country.code} /> */}
      {country?.translations[0].post_title && (
        <CountryPostContent
          post={country}
          loc={loc}
          variant={location.postContent.countryPage}
          minOffer={minOffer}
        />
      )}
      {subpagesSlugs.length > 0 && !isDistrict && !subsubpage ? (
        <SubpagesLinks
          current={country?.subpage_slug}
          subpagesSlugs={subpagesSlugs}
          countryName={country.translations[0].from_month_country_name || country.translations[0].name}
        />
      ) : null}
      {subpagesFromCities && subpagesFromCities.length > 0 && !nestingDistrict ? (
        <SubpagesLinks
          current={subsubpage ? country?.subsubpage_slug : country?.subpage_slug}
          subpagesSlugs={subpagesFromCities}
          countryName={country.translations[0].from_month_country_name || country.translations[0].name}
          subsubpage={subsubpage}
          district={country?.is_district}
        />
      ) : null}
      {nestingDistrict ? (
        <SubpagesLinks
          current={country.subdistrict_slug}
          subpagesSlugs={subpagesFromCities}
          countryName={country.translations[0].from_month_country_name || country.translations[0].name}
          nestingDistrict
        />
      ) : null}
    </section>
  );
}
