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
import { svgDate } from '../form-fields/svg';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { addYears, addDays } from 'date-fns';
import ru from 'date-fns/locale/ru';
import uk from 'date-fns/locale/uk';
import styles from './date.module.css';
import { setDate } from '../../../store/store';
import DatePickerGlobalStyle from '../../../styles/datePickerGlobalStyle';
import declension from 'utils/declension';

const PlusMinusBtns = ({ setPlusDays, plusDays }) => {
  const [dayText, setDayText] = useState('');

  useEffect(() => {
    setDayText(declension(plusDays, 'день', 'дня', 'дней'));
  }, [plusDays]);
  return (
    <div className={styles.plus_minus_btns}>
      <span>Выбранная дата</span>
      <button
        className={styles.plus_minus_btn}
        onClick={() => setPlusDays((prev) => prev - 1)}
        disabled={plusDays === 0}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="25"
            y1="21"
            x2="15"
            y2="21"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <span className={styles.plus_days_value}>{plusDays}</span>
      <button
        className={styles.plus_minus_btn}
        onClick={() => setPlusDays((prev) => prev + 1)}
        disabled={plusDays === 6}
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line
            x1="20"
            y1="15"
            x2="20"
            y2="25"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <line
            x1="25"
            y1="20"
            x2="15"
            y2="20"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>
      <span>{dayText}</span>
    </div>
  );
};

export default function Date({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
  initialDate,
  initialPlusDays,
}) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);
  const selectedDate = setDate();

  const [startDate, setStartDate] = useState(initialDate);
  const [plusDays, setPlusDays] = useState(initialPlusDays);

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

  const arr = [];
  for (let i = 0; i < plusDays; i++) {
    arr.push(addDays(startDate, i + 1));
  }

  const highlightWithRanges = [
    {
      'react-datepicker__day--highlighted-custom-2': arr,
    },
  ];

  registerLocale('ru', ru);
  registerLocale('uk', uk);
  setDefaultLocale('ru');

  const selectedHandler = () => {
    const newDate = { rawDate: startDate, plusDays };
    selectedDate(newDate);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgDate} />
      <h3 className="title">{popupName}</h3>
      <div
        className={`${styles.popup_scrollable_content} popup_scrollable_content`}
        ref={scrollable}
      >
        <DatePicker
          showPopperArrow={false}
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          minDate={initialDate}
          inline
          maxDate={addYears(initialDate, 1)}
          highlightDates={highlightWithRanges}
        />
        <PlusMinusBtns setPlusDays={setPlusDays} plusDays={plusDays} />
      </div>
      <div className="apply_btn_wrapper">
        <button className="apply_btn" onClick={selectedHandler}>
          Применить
        </button>
      </div>
      <DatePickerGlobalStyle />
    </div>
  );
}
