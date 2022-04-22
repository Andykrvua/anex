import { useRef, useEffect } from 'react';
// import { setUp } from '../../../store/store';
import useOutsideClick from '../../../utils/clickOutside';
import {
  useSetBodyScroll,
  getWidth,
  enableScroll,
  maxWidth,
  BODY,
} from '../../../utils/useBodyScroll';
import Header from './header';
import styles from './person.module.css';
import { svgPerson } from '../form-fields/svg';
import { unlock, clearBodyLocks } from 'tua-body-scroll-lock';

export default function Person({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
}) {
  useEffect(() => {
    const el2 = document.querySelector('.test');
    console.log(el2);
    unlock(el2);

    return () => {
      clearBodyLocks();
    };
  }, []);

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

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgPerson} />
      <h3 className={styles.title}>{popupName}</h3>
      <div className="popup_content">
        <div className="test">
          Smooth Pellentesque habitant morbi tristique senectus et netus et
          malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
          vitae, ultricies eget, tempor sit amet, Smooth Pellentesque habitant
          morbi tristique senectus et netus et malesuada fames ac turpis
          egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor
          sit amet, Smooth Pellentesque habitant morbi tristique senectus et
          netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet, Smooth Pellentesque habitant morbi tristique senectus
          et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam,
          feugiat vitae, ultricies eget, tempor sit amet, Smooth Pellentesque
          habitant morbi tristique senectus et netus et malesuada fames ac
          turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget,
          tempor sit amet,
        </div>
      </div>
      <div className={styles.apply_btn_wrapper}>
        <button className="apply_btn" onClick={closeModalHandler}>
          Применить
        </button>
      </div>
    </div>
  );
}
