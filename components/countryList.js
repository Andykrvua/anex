import { allCountry } from 'utils/allCountry';

export default function countryList({ variant }) {
  switch (variant) {
    case 'getSearch':
      console.log('getSearch');
      break;
    case 'getCountryPage':
      console.log('getCountryPage');
      break;
    case 'getCountryHotels':
      console.log('getCountryHotels');
      break;
    default:
      console.log('countryList component error');
      break;
  }
  return (
    <div className="all_country_wrapper">
      {allCountry.map((item) => {
        return (
          <div className="country_item" key={item.code}>
            <div className="country_item_img">
              <img src={item.img} alt="" />
            </div>
            <div className="country_item_name">{item.name}</div>
            <div className="country_item_price">{item.price}</div>
          </div>
        );
      })}
    </div>
  );
}
