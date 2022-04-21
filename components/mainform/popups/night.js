import { useRef } from 'react';
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
import styles from './night.module.css';
import { svgNight } from '../form-fields/svg';

export default function Night({
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

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgNight} />
      <h3 className={styles.title}>{popupName}</h3>
      <div className="popup_content"></div>
      <div className={styles.apply_btn_wrapper}>
        <button className="apply_btn" onClick={closeModalHandler}>
          Применить
        </button>
      </div>
    </div>
  );
}
