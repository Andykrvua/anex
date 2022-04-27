import { useRef, useEffect, useState } from 'react';
import useOutsideClick from '../../../utils/clickOutside';
import { allCountry } from '../../../utils/allCountry';
import {
  useSetBodyScroll,
  getSize,
  enableScroll,
  clear,
  disableScroll,
  maxWidth,
  BODY,
} from '../../../utils/useBodyScroll';
import Header from './header';
import { svgDown } from '../form-fields/svg';
import styles from './downApplySelected.module.css';
import CountryList from 'components/countryList';
import { countryListVariants } from 'utils/constants';

export default function DownApplySelected({ item, closeDownApplySelected }) {
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
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M26.657 15.343 15.343 26.657M26.657 26.657 15.343 15.343"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <div className={`${styles.apply_btn_wrapper} apply_btn_wrapper`}>
        <button className="apply_btn">Применить</button>
      </div>
    </div>
  );
}
