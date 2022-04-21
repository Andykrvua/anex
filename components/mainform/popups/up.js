import { useRef } from 'react';
import {
  useSetBodyScroll,
  getWidth,
  enableScroll,
  maxWidth,
  BODY,
} from '../../../utils/useBodyScroll';
import useOutsideClick from '../../../utils/clickOutside';
import { setUp } from '../../../store/store';
import Header from './header';
import { svgUp } from '../form-fields/svg';
import styles from './up.module.css';

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

  const selectUp = setUp();

  const inputHandler = (e) => {
    selectUp(e.target.value);
  };

  const upPoints = ['Запорожье', 'Киев', 'Львов', 'Одесса', 'Харьков'];

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgUp} />
      <h3 className={styles.title}>{popupName}</h3>
      <div className="popup_content">
        <div className={styles.input_wrapper}>
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
      <div className={styles.apply_btn_wrapper}>
        <button className="apply_btn" onClick={closeModalHandler}>
          Применить
        </button>
      </div>
    </div>
  );
}
