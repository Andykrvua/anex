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
import { useSetDate, useGetInitialDate } from '../../../store/store';
import DatePickerGlobalStyle from '../../../styles/datePickerGlobalStyle';
import declension from 'utils/declension';
import SvgPlus from 'components/svgPlus';
import SvgMinus from 'components/svgMinus';
import { useRouter } from 'next/router';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import SimpleBar from 'simplebar-react';

// change scroll depending on mobile or desktop
const SimpleBarWrapper = ({ size, children }) => {
  return (
    <>
      {size.width >= maxWidth ? (
        <SimpleBar className="mobile_default main_form_open_scroll" autoHide={true}>
          {children}
        </SimpleBar>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

const PlusMinusBtns = ({ setPlusDays, plusDays }) => {
  const [dayText, setDayText] = useState('');
  const intl = useIntl();
  const dTxt1 = intl.formatMessage({
    id: 'common.day1',
  });
  const dTxt2 = intl.formatMessage({
    id: 'common.day2',
  });
  const dTxt5 = intl.formatMessage({
    id: 'common.day5',
  });

  useEffect(() => {
    setDayText(declension(plusDays, dTxt1, dTxt2, dTxt5));
  }, [plusDays]);
  return (
    <div className={styles.plus_minus_btns}>
      <span>
        <FM id="mainform.date.t2" />
      </span>
      <button
        className={styles.plus_minus_btn}
        onClick={() => setPlusDays((prev) => prev - 1)}
        disabled={plusDays === 0}
      >
        <SvgMinus />
      </button>
      <span className={styles.plus_days_value}>{plusDays}</span>
      <button
        className={styles.plus_minus_btn}
        onClick={() => setPlusDays((prev) => prev + 1)}
        disabled={plusDays === 6}
      >
        <SvgPlus />
      </button>
      <span>{dayText}</span>
    </div>
  );
};

export default function Date({ setModalIsOpen, modalIsOpen, cName, popupName, storeDate, initialPlusDays }) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);
  const selectedDate = useSetDate();
  const initialDate = useGetInitialDate();

  const [startDate, setStartDate] = useState(storeDate);
  const [plusDays, setPlusDays] = useState(initialPlusDays);

  const { locale } = useRouter();
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
  setDefaultLocale(locale);

  const selectedHandler = () => {
    const newDate = { rawDate: startDate, plusDays };
    selectedDate(newDate);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  return (
    <SimpleBarWrapper size={size}>
      <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
        <Header closeModalHandler={closeModalHandler} svg={svgDate} />
        <h3 className="title">{popupName}</h3>
        <div className={`${styles.popup_scrollable_content} popup_scrollable_content`} ref={scrollable}>
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
            <FM id="common.apply" />
          </button>
        </div>
        <DatePickerGlobalStyle />
      </div>
    </SimpleBarWrapper>
  );
}
