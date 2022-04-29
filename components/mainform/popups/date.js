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
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from 'react-datepicker';
import { addYears, addDays } from 'date-fns';
import ru from 'date-fns/locale/ru';
import uk from 'date-fns/locale/uk';
// import 'react-datepicker/dist/react-datepicker.css';
// import 'styles/react-datepicker.css';
// import styles from './date.module.css';
// import { setUp } from '../../../store/store';
import DatePickerGlobalStyle from '../../../styles/datePickerGlobalStyle';

export default function Date({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
  initialDate,
}) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);
  // const ttt = setUp();

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

  const [startDate, setStartDate] = useState(initialDate);
  const [plusDays, setPlusDays] = useState(3); // max15days

  const arr = [];
  for (let i = 0; i < plusDays; i++) {
    arr.push(addDays(startDate, i + 1));
  }

  const highlightWithRanges = [
    {
      'react-datepicker__day--highlighted-custom-2': arr,
    },
  ];

  // useEffect(() => {
  //   console.log('222');
  //   console.log(
  //     scrollable.current.querySelector('.react-datepicker__day--selected')
  //   );
  //   console.log(startDate);
  // }, [startDate]);

  registerLocale('ru', ru);
  registerLocale('uk', uk);
  setDefaultLocale('ru');

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgDate} />
      <h3 className="title">{popupName}</h3>
      <div className="popup_scrollable_content" ref={scrollable}>
        <DatePicker
          showPopperArrow={false}
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          minDate={initialDate}
          inline
          maxDate={addYears(initialDate, 1)}
          highlightDates={highlightWithRanges}
        />
        <div>{plusDays}</div>
        <button
          onClick={() => setPlusDays((prev) => prev + 1)}
          disabled={plusDays === 14}
        >
          +
        </button>
        <button
          onClick={() => setPlusDays((prev) => prev - 1)}
          disabled={plusDays === 0}
        >
          -
        </button>
      </div>
      <div className="apply_btn_wrapper">
        <button className="apply_btn" onClick={closeModalHandler}>
          Применить
        </button>
      </div>
      <DatePickerGlobalStyle />
    </div>
  );
}
