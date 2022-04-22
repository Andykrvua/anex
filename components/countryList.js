import { allCountry } from 'utils/allCountry';
import styles from './countryList.module.css';

export default function countryList({ variant }) {
  switch (variant) {
    case 'getSearch':
      console.log('getSearch');
      return (
        <div className={styles.all_country_wrapper}>
          {allCountry.map((item) => {
            return (
              <div className={styles.country_item} key={item.code}>
                <div className={styles.country_item_img}>
                  <img src={item.img} alt={item.name} width="60" height="43" />
                </div>
                <div className={styles.country_item_name}>{item.name}</div>
                <div className={styles.country_item_price}>{item.price}</div>
              </div>
            );
          })}
        </div>
      );
    case 'getCountryPage':
      console.log('getCountryPage');
      return (
        <div className={styles.all_country_wrapper}>
          {allCountry.map((item) => {
            return (
              <div className={styles.country_item} key={item.code}>
                <div className={styles.country_item_img}>
                  <img src={item.img} alt="" />
                </div>
                <div className="country_item_name">{item.name}</div>
                <div className="country_item_price">{item.price}</div>
              </div>
            );
          })}
        </div>
      );
    case 'getCountryHotels':
      console.log('getCountryHotels');
      break;
    default:
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
