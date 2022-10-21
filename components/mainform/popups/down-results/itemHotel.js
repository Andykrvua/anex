import styles from './item.module.css';
import { stars, fetchImgUrl } from 'utils/constants';

export default function ItemHotel({ data, clickHandler }) {
  const image = data.img;
  return (
    <div
      className={styles.hotel_item}
      onClick={() =>
        clickHandler(
          data.name,
          data.id,
          data.countryId,
          (data.img = { src: `${fetchImgUrl}/3/60x60/${image}` }),
          {
            district: false,
            hotel: true,
            img: `${fetchImgUrl}/3/60x60/${image}`,
          }
        )
      }
    >
      <div className={styles.hotel_item_img}>
        <img
          src={`${fetchImgUrl}/3/60x60/${image}`}
          alt={data.name}
          width="60"
          height="43"
        />
      </div>
      <div className={styles.hotel_item_name_wrapper}>
        <div className={styles.hotel_item_name} title={data.name}>
          {data.name}
        </div>
        <div className={styles.hotel_item_stars}>
          {new Array(stars[data.stars]).fill(null).map((_, ind) => {
            return (
              <div className={styles.star} key={ind}>
                <img
                  src="/assets/img/svg/tour/star.svg"
                  alt="star"
                  width="12"
                  height="12"
                />
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.hotel_item_price_wrapper}>
        <span className={styles.hotel_item_price}>
          {data.uah ? `от ${data.uah} грн` : null}
        </span>
        <span className={styles.hotel_item_loc}>
          {data.provinceName
            ? `${data.provinceName}, ${data.countryName}`
            : `${data.cityName}, ${data.countryName}`}
        </span>
      </div>
    </div>
  );
}
