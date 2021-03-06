import { allCountry } from 'utils/allCountry';
import { countryListVariants } from '../utils/constants';
import styles from './countryList.module.css';

const CountryListGetSearch = ({ clickCountryItem, limit = 100 }) => {
  return (
    <div className={styles.all_country_wrapper}>
      {allCountry.map((item, i) => {
        if (i < limit) {
          return (
            <div
              className={`${styles.country_item} country_item`}
              key={item.code}
              onClick={(e) => clickCountryItem(e)}
              data-code={item.code}
            >
              <div className={styles.country_item_img}>
                <img src={item.img} alt={item.name} width="60" height="43" />
              </div>
              <div className={styles.country_item_name}>{item.name}</div>
              <div className={styles.country_item_price}>{item.price}</div>
            </div>
          );
        }
      })}
    </div>
  );
};

export default function countryList({ variant, clickCountryItem }) {
  switch (variant) {
    case countryListVariants.getSearch:
      // console.log('getSearch');
      return <CountryListGetSearch clickCountryItem={clickCountryItem} />;

    case countryListVariants.getSearchPopular:
      // console.log('getSearchPopular');
      return (
        <CountryListGetSearch clickCountryItem={clickCountryItem} limit={8} />
      );

    case countryListVariants.getCountryPage:
      // console.log('getCountryPage');
      return <CountryListGetSearch limit={8} />;

    case countryListVariants.getCountryHotels:
      // console.log('getCountryHotels');
      break;

    default:
      /* eslint-disable-next-line */
      console.log('countryList component error');
      return null;
  }
  // return (
  //   <div className="all_country_wrapper">
  //     {allCountry.map((item) => {
  //       return (
  //         <div className="country_item" key={item.code}>
  //           <div className="country_item_img">
  //             <img src={item.img} alt="" />
  //           </div>
  //           <div className="country_item_name">{item.name}</div>
  //           <div className="country_item_price">{item.price}</div>
  //         </div>
  //       );
  //     })}
  //   </div>
  // );
}
