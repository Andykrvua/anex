import { useRef, useEffect, useLayoutEffect, useState } from 'react';
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
import { svgUp } from '../form-fields/svg';
import { useSetUp } from '../../../store/store';
import styles from './up.module.css';

export default function UpWindow({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
}) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);
  const scrollableContent = useRef(null);

  const selectUp = useSetUp();

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth, size.width);

  const [contentStyle, setContentStyle] = useState(false);
  const [selectedUp, setSelectedUp] = useState(false);

  useLayoutEffect(() => {
    if (
      scrollable.current.clientHeight > scrollableContent.current.clientHeight
    ) {
      setContentStyle(true);
    } else {
      setContentStyle(false);
    }
  }, [size.height]);

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

  const inputHandler = (e) => {
    setSelectedUp(e.target.value);
  };

  const selectedHandler = () => {
    selectUp(selectedUp);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  const upPoints = ['Запорожье', 'Киев', 'Львов', 'Одесса', 'Харьков'];

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgUp} />
      <h3 className="title">{popupName}</h3>
      <div
        className={`${styles.popup_scrollable_content} popup_scrollable_content`}
        ref={scrollable}
        style={{ justifyContent: contentStyle ? 'center' : 'start' }}
      >
        <div className={styles.input_wrapper} ref={scrollableContent}>
          {upPoints.map((item, i) => {
            return (
              <label className={styles.input_label} key={i}>
                <input
                  className={styles.input}
                  type="radio"
                  name="up"
                  id={i}
                  onChange={inputHandler}
                  value={item}
                  defaultChecked={i === 0}
                />
                <span className={styles.input_label_text}>{item}</span>
              </label>
            );
          })}
        </div>
      </div>
      <div className="apply_btn_wrapper">
        <button className="apply_btn" onClick={selectedHandler}>
          Применить
        </button>
      </div>
    </div>
  );
}
