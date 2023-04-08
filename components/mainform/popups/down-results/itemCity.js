import styles from './item.module.css';
import { FormattedMessage as FM } from 'react-intl';

export default function ItemCity({ data, clickHandler }) {
  return (
    <div
      className={styles.city_item}
      onClick={() =>
        clickHandler(
          data.name,
          data.id,
          data.countryId,
          (data.img = {
            src: `/assets/img/svg/search_suggests/map-marker.svg`,
            styles: { width: '26px', height: '26px' },
            wrapper_styles: {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '43px',
              background:
                'linear-gradient(95.77deg, #006bd6 -23.84%, #0080ff 145.99%)',
              borderRadius: 'var(--def-radius)',
            },
          }),
          { district: true, hotel: false, img: '' }
        )
      }
    >
      <div className={styles.city_item_img}>
        <img
          src="/assets/img/svg/search_suggests/map-marker.svg"
          alt={data.name}
          width="26"
          height="26"
        />
      </div>
      <div
        className={
          data?.uah
            ? `${styles.city_item_name}`
            : `${styles.city_item_name} ${styles.city_item_name_2row}`
        }
      >
        {data.name}
      </div>
      {data?.uah && (
        <div className={styles.city_item_price}><FM id="common.ot" />{` ${data.uah} грн`}</div>
      )}
    </div>
  );
}
