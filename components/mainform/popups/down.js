import { useRef } from 'react';
// import { setUp } from '../../../store/store';
// import SimpleBar from 'simplebar-react';
import { svgDown } from '../form-fields/svg';
import useOutsideClick from '../../../utils/clickOutside';
import {
  useSetBodyScroll,
  getWidth,
  enableScroll,
  maxWidth,
  BODY,
} from '../../../utils/useBodyScroll';
import Header from './header';
import styles from './down.module.css';
import CountryList from 'components/countryList';
import { countryListVariants } from 'utils/constants';
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

export default function UpWindow({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
}) {
  const width = getWidth();
  const wrapperRef = useRef(null);

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth);

  const closeModalHandler = () => {
    if (width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  // const ttt = setUp();
  enableBodyScroll('.popup_content_ddd');
  enableBodyScroll('.test');
  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgDown} />
      <h3 className={styles.title}>{popupName}</h3>
      <div className="test">
        Smooth Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
        vitae, ultricies eget, tempor sit amet, Smooth Pellentesque habitant
        morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet,
        Smooth Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
        vitae, ultricies eget, tempor sit amet, Smooth Pellentesque habitant
        morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet,
        Smooth Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
        vitae, ultricies eget, tempor sit amet, Smooth Pellentesque habitant
        morbi tristique senectus et netus et malesuada fames ac turpis egestas.
        Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet,
        Smooth Pellentesque habitant morbi tristique senectus et netus et
        malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
        vitae, ultricies eget, tempor sit amet,
      </div>
      <div className={`${styles.popup_content} popup_content_ddd`}>
        {/* <div className="flex_container popup"> */}
        <div className={styles.down_input_wrapper}>
          <input
            // className={styles.down_input}
            type="text"
            name=""
            id=""
            placeholder="Страна / Курорт / Отель"
          />
        </div>
        {/* <SimpleBar
            autoHide={true}
            style={{ maxHeight: 'calc(100vh - 280px)' }}
            className="mobile_default"
          > */}
        <h5 className={styles.down_content_title}>Популярные направления</h5>
        <h5 className={styles.down_content_title}>Все страны (31)</h5>
        <CountryList variant={countryListVariants.getSearch} />
        {/* </SimpleBar> */}
        {/* </div> */}
      </div>
    </div>
  );
}
