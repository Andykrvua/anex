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
import styles from './down.module.css';
import CountryList from 'components/countryList';
import { countryListVariants } from 'utils/constants';
import DownApplySelected from './downApplySelected ';

export default function Down({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
}) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth, size.width);

  const [iosView, setIosView] = useState(0);
  // const [inputTranslateY, setInputTranslateY] = useState(0);
  const [country, setCountry] = useState('');
  const [countryData, setCountryData] = useState(false);
  console.log('ss', countryData);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        window.visualViewport.addEventListener('resize', resizeHandler);
        return () =>
          window.visualViewport.removeEventListener('resize', resizeHandler);
      }
    }
  }, []);

  function resizeHandler() {
    console.log('resize');
    // ios 13+ get height when keyboard is open
    setIosView(window.visualViewport.height);
  }

  useEffect(() => {
    if (size.width < maxWidth) {
      if (modalIsOpen) {
        disableScroll(scrollable.current);
      }
    }
    return () => {
      clear();
    };
  }, [modalIsOpen, size.width]);

  const closeModalHandler = () => {
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  const inputOnchange = (e) => {
    setCountry(e.target.value);
    console.log(e.target.value);
    const x = e.target.value;
    console.log(x.length);
    // if (x.length) {
    //   setInputTranslateY(60);
    //   setIosView((prev) => prev + 60);
    // } else {
    //   setInputTranslateY(0);
    //   setIosView(0);
    // }
  };

  const clickCountryItem = (e) => {
    const selected = allCountry.find(
      (item) => item.code === e.target.closest('.country_item').dataset.code
    );
    setCountry(selected.name);
    setCountryData(selected);
  };

  const closeDownApplySelected = () => {
    setCountryData(false);
  };

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgDown} />
      <h3 className="title">{popupName}</h3>
      <div className={styles.down_input_wrapper}>
        <input
          // className={styles.down_input}
          type="text"
          name=""
          id=""
          placeholder="Страна / Курорт / Отель"
          onChange={(e) => inputOnchange(e)}
          // style={
          //   iosView
          //     ? {
          //         transform: `translateY(-${inputTranslateY}px)`,
          //         transition: 'transform 0.3s',
          //       }
          //     : {}
          // }
          value={country}
        />
      </div>
      <div
        className="popup_scrollable_content"
        ref={scrollable}
        style={
          iosView
            ? {
                flex: `0 0 ${iosView - 243}px`,
                // transform: `translateY(-${inputTranslateY}px)`,
              }
            : {}
        }
      >
        {iosView}
        <h5 className={styles.down_content_title}>Популярные направления</h5>
        <CountryList
          variant={countryListVariants.getSearchPopular}
          clickCountryItem={clickCountryItem}
        />
        <h5 className={styles.down_content_title}>Все страны (31)</h5>
        <CountryList
          variant={countryListVariants.getSearch}
          clickCountryItem={clickCountryItem}
        />
      </div>
      {countryData && (
        <DownApplySelected
          item={countryData}
          closeDownApplySelected={closeDownApplySelected}
        />
      )}
    </div>
  );
}
