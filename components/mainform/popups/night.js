import { useRef, useEffect } from 'react';
import useOutsideClick from '../../../utils/clickOutside';
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
import { svgNight } from '../form-fields/svg';
import styles from './night.module.css';
import { getNight, setNight } from '../../../store/store';

export default function Night({
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

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgNight} />
      <h3 className="title">{popupName}</h3>
      <div className="popup_scrollable_content" ref={scrollable}></div>
      <div className="apply_btn_wrapper">
        <button className="apply_btn" onClick={closeModalHandler}>
          Применить
        </button>
      </div>
    </div>
  );
}
