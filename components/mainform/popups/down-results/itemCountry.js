import styles from './item.module.css';
import { useIntl } from 'react-intl';

export default function ItemCountry({ data, clickHandler }) {
  const intl = useIntl();
  return (
    <div
      className={`${styles.country_item} result_item`}
      onClick={() =>
        clickHandler(
          data.value,
          data.id,
          data.id,
          (data.img = { src: `/assets/img/svg/flags/code/${data.code}.svg` }),
          {
            district: false,
            hotel: false,
            img: `/assets/img/svg/flags/code/${data.code}.svg`,
          }
        )
      }
    >
      <div className={styles.country_item_img}>
        <img
          src={`/assets/img/svg/flags/code/${data.code}.svg`}
          alt={data.name}
          width="60"
          height="43"
        />
      </div>
      <div
        className={
          data?.uah
            ? `${styles.country_item_name}`
            : `${styles.country_item_name} ${styles.country_item_name_2row}`
        }
      >
        {data.name}
      </div>
      {data?.uah && (
        <div className={styles.country_item_price}>{`${intl.formatMessage({
          id: 'common.ot',
        })} ${data.uah} грн`}</div>
      )}
    </div>
  );
}
