import { useEffect, useMemo, useRef, useState } from 'react';
import {
  addDays,
  addYears,
  differenceInDays,
  isBefore,
  isWithinInterval,
  startOfDay,
  subDays,
} from 'date-fns';
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import ru from 'date-fns/locale/ru';
import uk from 'date-fns/locale/uk';
import Header from './header';
import SwitchMenu from '../../common/switchMenu/switchMenu';
import { svgDate } from '../form-fields/svg';
import { BODY, enableScroll, getSize, maxWidth, useSetBodyScroll } from '../../../utils/useBodyScroll';
import useOutsideClick from '../../../utils/clickOutside';
import { useGetDate, useGetInitialDate, useSetDate } from '../../../store/store';
import usePrevious from '../../../common/hooks/usePrevious';
import DatePickerGlobalStyle from '../../../styles/datePickerGlobalStyle';
import {
  DATE_TYPES,
  DEFAULT_PLUS_DAYS,
  addLocalDays,
  isSameLocalDate,
  normalizeDateValue,
} from '../../../utils/dateRange';
import styles from './multiple-datepicker.module.css';

const MAX_ALLOWED_DAYS = 14;
const ALLOWED_PLUS_MINUS_DAYS = [1, 3, 7];
const PLUS_DAYS_KEY_TO_VALUE = { d1: 1, d3: 3, d7: 7 };
const PLUS_DAYS_VALUE_TO_KEY = { 1: 'd1', 3: 'd3', 7: 'd7' };

function calcDateSelection({
  date,
  plusDays = 0,
  initialDate,
  disabledPlusBefore = false,
  customAdditionalDays = 0,
}) {
  const middleDate = startOfDay(date);
  const normalizedInitialDate = startOfDay(initialDate);

  if (isSameLocalDate(middleDate, normalizedInitialDate)) {
    const additionalDays = customAdditionalDays || plusDays + 1;

    return {
      startDate: normalizedInitialDate,
      endDate: addDays(normalizedInitialDate, additionalDays - 1),
      middleDate: normalizedInitialDate,
      additionalDays,
    };
  }

  const daysBefore = disabledPlusBefore
    ? 0
    : Math.min(differenceInDays(middleDate, normalizedInitialDate), plusDays);
  const additionalDays = customAdditionalDays || daysBefore + plusDays + 1;
  const startDate = subDays(middleDate, daysBefore);

  return {
    startDate,
    endDate: addDays(startDate, additionalDays - 1),
    middleDate,
    additionalDays,
  };
}

export default function MultipleDatepicker({ setModalIsOpen, modalIsOpen, cName, popupName }) {
  const { locale } = useRouter();
  const intl = useIntl();
  const size = getSize();
  const wrapperRef = useRef(null);
  const datepickerHandlers = useRef(null);
  const selectedDate = useSetDate();
  const initialDate = useGetInitialDate();
  const date = useGetDate();
  const storeDate = useMemo(() => normalizeDateValue(date, initialDate), [date, initialDate]);
  const prevDateType = usePrevious(storeDate.dateType);

  const isMobile = useMemo(() => size.width < maxWidth, [size]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [middleDate, setMiddleDate] = useState(null);
  const [plusDays, setPlusDays] = useState(storeDate.plusDays);
  const [activePlusDay, setActivePlusDay] = useState(storeDate.plusDays);
  const [additionalDays, setAdditionalDays] = useState(storeDate.additionalDays);
  const [dateType, setDateType] = useState(storeDate.dateType);
  const [, setViewMonth] = useState(initialDate);
  const [minDate, setMinDate] = useState(initialDate);
  const [maxDate, setMaxDate] = useState(addYears(initialDate, 1));
  const [hoveredDate, setHoveredDate] = useState(null);

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth, size.width);

  useEffect(() => {
    if (dateType === DATE_TYPES.RANGE) {
      const rangeEnd = addLocalDays(storeDate.rawDate, storeDate.additionalDays - 1);
      setStartDate(storeDate.rawDate);
      setEndDate(rangeEnd);
      setMiddleDate(addLocalDays(storeDate.rawDate, storeDate.plusDays));
      setAdditionalDays(storeDate.additionalDays);
      setViewMonth(storeDate.rawDate);
      return;
    }

    const middle = isSameLocalDate(storeDate.rawDate, initialDate)
      ? storeDate.rawDate
      : addLocalDays(storeDate.rawDate, storeDate.plusDays);
    const calculated = calcDateSelection({
      date: middle,
      plusDays: storeDate.plusDays,
      initialDate,
    });

    setStartDate(calculated.startDate);
    setEndDate(calculated.endDate);
    setMiddleDate(calculated.middleDate);
    setAdditionalDays(calculated.additionalDays);
    setViewMonth(calculated.middleDate);
  }, [initialDate, storeDate, dateType]);

  useEffect(() => {
    if (prevDateType === DATE_TYPES.RANGE && dateType === DATE_TYPES.DATE) {
      const nextPlusDays = ALLOWED_PLUS_MINUS_DAYS.includes(activePlusDay)
        ? activePlusDay
        : DEFAULT_PLUS_DAYS;
      const baseDate = startDate || initialDate;
      const calculated = calcDateSelection({
        date: middleDate || baseDate,
        plusDays: nextPlusDays,
        initialDate,
      });

      setPlusDays(nextPlusDays);
      setActivePlusDay(nextPlusDays);
      setStartDate(calculated.startDate);
      setEndDate(calculated.endDate);
      setMiddleDate(calculated.middleDate);
      setAdditionalDays(calculated.additionalDays);
      setMinDate(initialDate);
      setMaxDate(addYears(initialDate, 1));
      selectedDate({
        rawDate: calculated.startDate,
        plusDays: nextPlusDays,
        additionalDays: calculated.additionalDays,
        dateType: DATE_TYPES.DATE,
      });
    }
  }, [activePlusDay, dateType, initialDate, middleDate, prevDateType, selectedDate, startDate]);

  useEffect(() => {
    registerLocale('ru', ru);
    registerLocale('uk', uk);
    setDefaultLocale(locale);
  }, [locale]);

  const highlightDates = useMemo(() => {
    if (!startDate || !middleDate) {
      return [];
    }

    const days = Array.from({ length: additionalDays }, (_, index) => addDays(startDate, index));

    return [
      {
        'react-datepicker__day--highlighted-custom-2': days,
      },
      {
        'react-datepicker__day--active': [middleDate],
      },
    ];
  }, [additionalDays, middleDate, startDate]);

  const dateTypesList = useMemo(
    () => [
      {
        name: intl.formatMessage({ id: 'mainform.multiple-datepicker.types.date' }),
        value: DATE_TYPES.DATE,
      },
      {
        name: intl.formatMessage({ id: 'mainform.multiple-datepicker.types.range' }),
        value: DATE_TYPES.RANGE,
      },
    ],
    [intl],
  );

  const plusDaysList = useMemo(
    () => [
      {
        name: `± 1 ${intl.formatMessage({ id: 'common.day1' })}`,
        value: 'd1',
      },
      {
        name: `± 3 ${intl.formatMessage({ id: 'common.day2' })}`,
        value: 'd3',
      },
      {
        name: `± 7 ${intl.formatMessage({ id: 'common.day5' })}`,
        value: 'd7',
      },
    ],
    [intl],
  );

  const confirmDates = ({ nextRawDate, nextPlusDays, nextAdditionalDays, nextDateType = dateType }) => {
    selectedDate({
      rawDate: nextRawDate,
      plusDays: nextPlusDays,
      additionalDays: nextAdditionalDays,
      dateType: nextDateType,
    });
  };

  const handleDateSelection = ({ date, nextPlusDays = plusDays }) => {
    const calculated = calcDateSelection({
      date,
      plusDays: nextPlusDays,
      initialDate,
      disabledPlusBefore: false,
    });

    setStartDate(calculated.startDate);
    setEndDate(calculated.endDate);
    setMiddleDate(calculated.middleDate);
    setAdditionalDays(calculated.additionalDays);
    setViewMonth(calculated.middleDate);
    confirmDates({
      nextRawDate: calculated.startDate,
      nextPlusDays,
      nextAdditionalDays: calculated.additionalDays,
    });
  };

  const handlePlusDaysChange = (value) => {
    const nextPlusDays = PLUS_DAYS_KEY_TO_VALUE[value];
    const baseDate = middleDate || startDate || initialDate;

    setPlusDays(nextPlusDays);
    setActivePlusDay(nextPlusDays);
    handleDateSelection({ date: baseDate, nextPlusDays });
  };

  const handleDateTypeChange = (value) => {
    const nextType = value;
    setDateType(nextType);

    if (nextType === DATE_TYPES.RANGE) {
      const rangeStart = startDate || storeDate.rawDate;
      const rangeEnd = endDate || addLocalDays(rangeStart, additionalDays - 1);
      const nextAdditionalDays = differenceInDays(rangeEnd, rangeStart) + 1;
      const nextPlusDays = Math.floor((nextAdditionalDays - 1) / 2);

      setPlusDays(nextPlusDays);
      setAdditionalDays(nextAdditionalDays);
      setMiddleDate(addLocalDays(rangeStart, nextPlusDays));
      confirmDates({
        nextRawDate: rangeStart,
        nextPlusDays,
        nextAdditionalDays,
        nextDateType: nextType,
      });
      return;
    }

    const nextPlusDays = ALLOWED_PLUS_MINUS_DAYS.includes(activePlusDay) ? activePlusDay : DEFAULT_PLUS_DAYS;
    const calculated = calcDateSelection({
      date: middleDate || startDate || initialDate,
      plusDays: nextPlusDays,
      initialDate,
    });

    setPlusDays(nextPlusDays);
    setActivePlusDay(nextPlusDays);
    setStartDate(calculated.startDate);
    setEndDate(calculated.endDate);
    setMiddleDate(calculated.middleDate);
    setAdditionalDays(calculated.additionalDays);
    confirmDates({
      nextRawDate: calculated.startDate,
      nextPlusDays,
      nextAdditionalDays: calculated.additionalDays,
      nextDateType: nextType,
    });
  };

  const selectedHandler = () => {
    confirmDates({
      nextRawDate: startDate,
      nextPlusDays: plusDays,
      nextAdditionalDays: additionalDays,
    });

    if (isMobile) {
      enableScroll(BODY);
    }

    setModalIsOpen('');
  };

  const closeModalHandler = () => {
    if (isMobile) {
      enableScroll(BODY);
    }

    setModalIsOpen('');
  };

  const datePickerProps = useMemo(() => {
    if (dateType === DATE_TYPES.RANGE) {
      return {
        startDate,
        endDate,
        selectsRange: true,
        onChange: (dates = []) => {
          const [nextStart, nextEnd] = dates;
          if (!nextStart) {
            return;
          }

          const normalizedStart = startOfDay(nextStart);
          const daysBeforeStart = Math.min(MAX_ALLOWED_DAYS, differenceInDays(normalizedStart, initialDate));

          setStartDate(normalizedStart);
          setEndDate(nextEnd ? startOfDay(nextEnd) : null);
          setMinDate(subDays(normalizedStart, daysBeforeStart));
          setMaxDate(addDays(normalizedStart, MAX_ALLOWED_DAYS));
          setViewMonth(normalizedStart);

          if (nextEnd) {
            const normalizedEnd = startOfDay(nextEnd);
            const nextAdditionalDays = differenceInDays(normalizedEnd, normalizedStart) + 1;
            const nextPlusDays = Math.floor((nextAdditionalDays - 1) / 2);

            setPlusDays(nextPlusDays);
            setAdditionalDays(nextAdditionalDays);
            setMiddleDate(addLocalDays(normalizedStart, nextPlusDays));
            setMinDate(initialDate);
            setMaxDate(addYears(initialDate, 1));
            confirmDates({
              nextRawDate: normalizedStart,
              nextPlusDays,
              nextAdditionalDays,
            });
          }
        },
      };
    }

    return {
      onChange: (nextDate) => handleDateSelection({ date: nextDate }),
      highlightDates,
    };
  }, [additionalDays, dateType, endDate, highlightDates, initialDate, plusDays, startDate]);

  return (
    <div className={styles.popup_container} ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgDate} />
      <h3 className={`title ${styles.popup_title}`}>{popupName}</h3>
      <div className={styles.popup_nav}>
        <button
          type="button"
          onClick={() => datepickerHandlers.current?.decreaseMonth()}
          className={`${styles.popup_nav_btn} ${styles.popup_nav_btn__previous}`}
        />
        <SwitchMenu
          items={dateTypesList}
          name="date_types_switcher"
          callback={[dateType, handleDateTypeChange]}
        />
        <button
          type="button"
          onClick={() => datepickerHandlers.current?.increaseMonth()}
          className={`${styles.popup_nav_btn} ${styles.popup_nav_btn__next}`}
        />
      </div>
      <div className={styles.popup_datepicker}>
        <DatePicker
          {...datePickerProps}
          showPopperArrow={false}
          minDate={minDate}
          maxDate={maxDate}
          monthsShown={isMobile ? 1 : 2}
          inline
          selected={middleDate || startDate || initialDate}
          disabledKeyboardNavigation
          onDayMouseEnter={(date) => setHoveredDate(date)}
          dayClassName={(date) => {
            if (dateType === DATE_TYPES.DATE) {
              return undefined;
            }

            if (startDate && !endDate && hoveredDate) {
              const rangeStart = isBefore(hoveredDate, startDate) ? hoveredDate : startDate;
              const rangeEnd = isBefore(hoveredDate, startDate) ? startDate : hoveredDate;

              if (
                isWithinInterval(date, {
                  start: startOfDay(rangeStart),
                  end: startOfDay(rangeEnd),
                }) &&
                !isBefore(date, minDate)
              ) {
                return 'react-datepicker__day--in-range';
              }
            }

            return undefined;
          }}
          renderCustomHeader={({ date: headerDate, decreaseMonth, increaseMonth }) => {
            datepickerHandlers.current = {
              decreaseMonth,
              increaseMonth,
              monthDate: headerDate,
            };

            return (
              <div className="react-datepicker__custom-header">
                <button
                  type="button"
                  onClick={decreaseMonth}
                  className={`${styles.popup_nav_btn} ${styles.popup_nav_btn__previous}`}
                />
                <span className="react-datepicker__current-month">
                  {headerDate.toLocaleString(locale, {
                    month: 'long',
                  })}
                </span>
                <button
                  type="button"
                  onClick={increaseMonth}
                  className={`${styles.popup_nav_btn} ${styles.popup_nav_btn__next}`}
                />
              </div>
            );
          }}
        />
      </div>
      <div className={styles.popup_footer}>
        {dateType === DATE_TYPES.DATE ? (
          <div className={styles.popup_footer_plus_days_wrapper}>
            <SwitchMenu
              items={plusDaysList}
              name="plus_days_switcher"
              callback={[PLUS_DAYS_VALUE_TO_KEY[activePlusDay], handlePlusDaysChange]}
            />
          </div>
        ) : (
          <div />
        )}
        <button type="button" className="apply_btn" onClick={selectedHandler}>
          <FM id="common.apply" />
        </button>
      </div>
      <DatePickerGlobalStyle />
    </div>
  );
}
