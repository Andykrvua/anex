import { useRef, useEffect, useState } from 'react';
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
import { useGetNight, useSetNight } from '../../../store/store';
import { FormattedMessage as FM } from 'react-intl';

export default function Night({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
}) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const defaultNight = useGetNight();
  const selectedNight = useSetNight();

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth, size.width);

  const [fromNight, setFromNight] = useState(Number(defaultNight.from));
  const [toNight, setToNight] = useState(Number(defaultNight.to));

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

  const selectNightRange = (from, to) => {
    setFromNight(from);
    setToNight(to);

    // Применить сразу после выбора диапазона
    const newNight = { from, to };
    selectedNight(newNight);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  return (
    <div className={styles.nights_custom_wrapper}>
      <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
        {/* <Header closeModalHandler={closeModalHandler} svg={svgNight} />
        <h3 className="title">{popupName}</h3> */}
        <div
          className={`${styles.popup_scrollable_content} popup_scrollable_content`}
          ref={scrollable}
        >
          <div className={styles.night_button_wrapper}>
            <button onClick={() => selectNightRange(1, 3)} className={styles.night_button_new}>1-3 ночи<span className={styles.night_button_span}>, 2-4 дня</span></button>
            <button onClick={() => selectNightRange(2, 4)} className={styles.night_button_new}>2-4 ночи<span className={styles.night_button_span}>, 3-5 дней</span></button>
            <button onClick={() => selectNightRange(3, 5)} className={styles.night_button_new}>3-5 ночей<span className={styles.night_button_span}>, 4-6 дней</span></button>
            <button onClick={() => selectNightRange(4, 6)} className={styles.night_button_new}>4-6 ночей<span className={styles.night_button_span}>, 5-7 дней</span></button>
            <button onClick={() => selectNightRange(5, 7)} className={styles.night_button_new}>5-7 ночей<span className={styles.night_button_span}>, 6-8 дней</span></button>
            <button onClick={() => selectNightRange(6, 8)} className={styles.night_button_new}>6-8 ночей<span className={styles.night_button_span}>, 7-9 дней</span></button>
            <button onClick={() => selectNightRange(7, 6)} className={styles.night_button_new}>7-9 ночей<span className={styles.night_button_span}>, 8-10 дней</span></button>
            <button onClick={() => selectNightRange(8, 6)} className={styles.night_button_new}>8-10 ночей<span className={styles.night_button_span}>, 9-11 дней</span></button>
            <button onClick={() => selectNightRange(9, 11)} className={styles.night_button_new}>9-11 ночей<span className={styles.night_button_span}>, 10-12 дней</span></button>
            <button onClick={() => selectNightRange(10, 12)} className={styles.night_button_new}>10-12 ночей<span className={styles.night_button_span}>, 11-13 дней</span></button>
            <button onClick={() => selectNightRange(11, 13)} className={styles.night_button_new}>11-13 ночей<span className={styles.night_button_span}>, 12-14 дней</span></button>
            <button onClick={() => selectNightRange(12, 14)} className={styles.night_button_new}>12-14 ночей<span className={styles.night_button_span}>, 13-15 дней</span></button>
            <button onClick={() => selectNightRange(13, 15)} className={styles.night_button_new}>13-15 ночей<span className={styles.night_button_span}>, 14-16 дней</span></button>
            <button onClick={() => selectNightRange(14, 16)} className={styles.night_button_new}>14-16 ночей<span className={styles.night_button_span}>, 15-17 дней</span></button>
            <button onClick={() => selectNightRange(15, 17)} className={styles.night_button_new}>15-17 ночей<span className={styles.night_button_span}>, 16-18 дней</span></button>
            <button onClick={() => selectNightRange(16, 18)} className={styles.night_button_new}>16-18 ночей<span className={styles.night_button_span}>, 17-19 дней</span></button>
            <button onClick={() => selectNightRange(18, 20)} className={styles.night_button_new}>18-20 ночей<span className={styles.night_button_span}>, 18-20 дней</span></button>
            <button onClick={() => selectNightRange(19, 21)} className={styles.night_button_new}>19-21 ночь<span className={styles.night_button_span}>, 19-21 день</span></button>
            <button onClick={() => selectNightRange(20, 22)} className={styles.night_button_new}>20-22 ночи<span className={styles.night_button_span}>, 20-22 дня</span></button>
            <button onClick={() => selectNightRange(21, 23)} className={styles.night_button_new}>21-23 ночи<span className={styles.night_button_span}>, 21-23 дня</span></button>
            <button onClick={() => selectNightRange(22, 24)} className={styles.night_button_new}>22-24 ночи<span className={styles.night_button_span}>, 22-24 дня</span></button>
            <button onClick={() => selectNightRange(23, 25)} className={styles.night_button_new}>23-25 ночи<span className={styles.night_button_span}>, 23-25 дней</span></button>
            <button onClick={() => selectNightRange(24, 26)} className={styles.night_button_new}>24-26 ночи<span className={styles.night_button_span}>, 24-26 дней</span></button>
            <button onClick={() => selectNightRange(25, 27)} className={styles.night_button_new}>25-27 ночи<span className={styles.night_button_span}>, 26-28 дней</span></button>
            <button onClick={() => selectNightRange(26, 28)} className={styles.night_button_new}>26-28 ночи<span className={styles.night_button_span}>, 27-29 дней</span></button>
            <button onClick={() => selectNightRange(27, 29)} className={styles.night_button_new}>27-29 ночи<span className={styles.night_button_span}>, 28-30 дней</span></button>
            <button onClick={() => selectNightRange(28, 30)} className={styles.night_button_new}>28-30 ночи<span className={styles.night_button_span}>, 29-31 день</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}
