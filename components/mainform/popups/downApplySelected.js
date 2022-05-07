import styles from './downApplySelected.module.css';
import CloseSvg from '../../common/closeSvg';
import { FormattedMessage as FM } from 'react-intl';

export default function DownApplySelected({
  item,
  setCountryData,
  selectDownHandler,
}) {
  const selected = () => {
    selectDownHandler(item.name);
  };

  const closeDownApplySelected = () => {
    setCountryData(false);
  };
  return (
    <div className={styles.down_selected_block}>
      <div
        className={`${styles.country_item} country_item`}
        key={item.code}
        data-code={item.code}
      >
        <div className={styles.country_item_img}>
          <img src={item.img} alt={item.name} width="60" height="43" />
        </div>
        <div className={styles.country_item_name}>{item.name}</div>
        <div className={styles.country_item_price}>{item.price}</div>
      </div>
      <button
        className={`${styles.popup_close} ${styles.popup_close_not_mobile} svg_btn svg_btn_stroke`}
        aria-label="Закрыть"
        onClick={closeDownApplySelected}
      >
        <CloseSvg />
      </button>
      <div className={`${styles.apply_btn_wrapper} apply_btn_wrapper`}>
        <button onClick={selected} className="apply_btn">
          <FM id="common.apply" />
        </button>
      </div>
    </div>
  );
}
