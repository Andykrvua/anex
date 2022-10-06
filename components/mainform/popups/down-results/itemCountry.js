import styles from './item.module.css';

export default function ItemCountry({ data, clickHandler }) {
  return (
    <div
      className={`${styles.country_item} result_item`}
      onClick={() =>
        clickHandler(
          data.value,
          data.id,
          (data.img = { src: `/assets/img/svg/flags/code/${data.code}.svg` }),
          {
            district: false,
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
        <div className={styles.country_item_price}>{`от ${data.uah} грн`}</div>
      )}
    </div>
  );
}
