import {
    BODY,
    enableScroll,
    getSize,
    maxWidth,
    useSetBodyScroll
} from "../../../utils/useBodyScroll";
import { useEffect, useMemo, useRef, useState } from "react";
import { useGetDate, useGetInitialDate, useSetDate } from "../../../store/store";
import {
    differenceInDays,
    differenceInMonths,
    endOfDay,
    isAfter,
    isBefore,
    isSameDay,
    isSameMonth,
    isWithinInterval,
    startOfDay, startOfMonth,
    subDays,
} from 'date-fns';
import { addYears, addDays } from 'date-fns';
import { useRouter } from "next/router";
import useOutsideClick from "../../../utils/clickOutside";
import { FormattedMessage as FM, useIntl } from "react-intl";
import usePrevious from "../../../common/hooks/usePrevious";

import { svgDate, svgNext, svgPrev } from "../form-fields/svg";
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import Header from "./header";
import DatePickerGlobalStyle from "../../../styles/datePickerGlobalStyle";
import SwitchMenu from "../../common/switchMenu/switchMenu";

import ru from 'date-fns/locale/ru';
import uk from 'date-fns/locale/uk';

import styles from "./multiple-datepicker.module.css";


const DATE_TYPES = {
    DATE: 'date',
    RANGE: 'range'
}

const MAX_ALLOWED_DAYS = 14;

const ALLOWED_PLUS_MINUS_DAYS = [1,3,7];

const calcDateTypeHandler = ({ date, plusDays = 0, initialDate, disabledPlusBefore = false, customAdditionalDays = 0 }) => {
    let startDate, endDate, calculatedAdditionalDays = 0, middleDate;
    const normalizedDate = startOfDay(date);
    const normalizedInitialDate = startOfDay(initialDate);
    if (isSameDay(normalizedDate,  normalizedInitialDate)) {
        startDate =  normalizedInitialDate;
        calculatedAdditionalDays = customAdditionalDays ? customAdditionalDays : plusDays;
        middleDate = normalizedInitialDate;
        endDate = addDays(startDate, plusDays);
    } else if (isAfter(normalizedDate, normalizedInitialDate)) {
        const daysBefore = Math.min(differenceInDays(normalizedDate, normalizedInitialDate), Math.min(plusDays, differenceInDays(normalizedDate, normalizedInitialDate)));
        const daysAfter = plusDays;
        startDate = disabledPlusBefore ? normalizedDate : subDays(normalizedDate, daysBefore);
        calculatedAdditionalDays  = customAdditionalDays ? customAdditionalDays : daysBefore + daysAfter + 1;
        middleDate = normalizedDate;
        endDate = addDays(startDate, calculatedAdditionalDays - 1);
    }
    return {
        newStartDate: startDate,
        newEndDate: endDate,
        calculatedAdditionalDays,
        newMiddleDate: middleDate
    }
}


const MultipleDatepicker = ({ setModalIsOpen, modalIsOpen, cName, popupName }) => {
    const { locale } = useRouter();
    const size = getSize();
    const wrapperRef = useRef(null);
    const selectedDate = useSetDate();
    const initialDate = useGetInitialDate();
    const intl = useIntl();
    const date = useGetDate();
    const storeDate = useMemo(() => startOfDay(date.rawDate),[date]);
    const initialPlusDays = useMemo(() => date.plusDays,[date]);
    const initialAddPlusDays = useMemo(() => date.additionalDays,[date]);
    const dateType = useMemo(() => date.dateType, [date]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [middleDate, setMiddleDate] = useState(null);
    const [plusDays, setPlusDays] = useState(initialPlusDays);
    const [activePlusDay, setActivePlusDay] = useState(initialPlusDays);
    const [additionalDays, setAdditionalDays] = useState(initialAddPlusDays);
    const [viewMonth, setViewMonth] = useState(initialDate);
    const [minDate, setMinDate] = useState(initialDate);
    const [maxDate, setMaxDate] = useState(addYears(initialDate, 1));
    const prevDateType = usePrevious(dateType);
    const [hoveredDate, setHoveredDate] = useState(null);
    const datepickerHandlers = useRef(null);

    const isMobile = useMemo(() => size.width < maxWidth,[size]);

    useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
    useSetBodyScroll(modalIsOpen, maxWidth, size.width);

    useEffect(() => {
        const { newStartDate, newEndDate, newMiddleDate } = calcDateTypeHandler({
            date: isSameDay(storeDate,initialDate) || dateType === DATE_TYPES.RANGE ? storeDate : addDays(storeDate, initialPlusDays),
            plusDays: initialPlusDays,
            initialDate,
            disabledPlusBefore: dateType === DATE_TYPES.RANGE,
            customAdditionalDays: dateType === DATE_TYPES.RANGE ? initialAddPlusDays: 0
        });
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setMiddleDate(newMiddleDate);
        setAdditionalDays(initialAddPlusDays);
        if(!isMobile) {
            setViewMonth(newStartDate);
        } else {
            setViewMonth(newMiddleDate);
        }
    }, []);

    useEffect(() => {
        if(prevDateType === DATE_TYPES.RANGE && dateType !== prevDateType) {
            const checkPlusDays = ALLOWED_PLUS_MINUS_DAYS.includes(plusDays);
            if(!checkPlusDays) {
                setPlusDays(ALLOWED_PLUS_MINUS_DAYS[0]);
                setActivePlusDay(ALLOWED_PLUS_MINUS_DAYS[0]);
                handleChangeDateType({ date: startDate, plusDays: ALLOWED_PLUS_MINUS_DAYS[0] })
            }
            setMinDate(initialDate);
            setMaxDate(addYears(initialDate, 1));
        }
    }, [dateType]);

    const highlightDates = useMemo(() => {
        if(!startDate || !middleDate) {
            return  [];
        }
        const arr = Array.from({ length: additionalDays },(_,x) => addDays(startDate, x + (isSameDay(startDate, initialDate) && isSameDay(startDate,middleDate) ? 1:0) ));
        return [
            {
                'react-datepicker__day--highlighted-custom-2': arr,
            },
            {
                'react-datepicker__day--active': [middleDate],
            },
        ];
    }, [startDate, additionalDays,middleDate,viewMonth]);

    const handleChangeDateType = ({ date, plusDays =  0}) => {
        const { newStartDate, newEndDate, newMiddleDate, calculatedAdditionalDays } = calcDateTypeHandler({
            date,
            plusDays,
            initialDate
        });
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setAdditionalDays(calculatedAdditionalDays);
        setMiddleDate(newMiddleDate);
        if(!isMobile) {
            const currentMonthDate= datepickerHandlers.current.monthDate;
            setViewMonth(prev => {
                const startOfMonthPrev = startOfMonth(prev);
                const startOfMonthCurrent = startOfMonth(currentMonthDate);
                const startOfMonthStart = startOfMonth(newStartDate);
                const startOfMonthEnd = startOfMonth(newEndDate);
                return differenceInMonths(startOfMonthStart,startOfMonthPrev) < 0 || (differenceInMonths(startOfMonthStart,startOfMonthPrev) > 1 && !isSameMonth(startOfMonthStart,startOfMonthCurrent)) ? newStartDate: differenceInMonths(startOfMonthEnd,startOfMonthPrev) > 0 && !isSameMonth(startOfMonthEnd,startOfMonthCurrent) ? newEndDate: prev
            });
        } else {
            setViewMonth(newMiddleDate);
        }

        confirmDates({
            rawDate: newStartDate,
            plusDays,
            additionalDays: calculatedAdditionalDays,
        });
    }

    const datePickerProps = useMemo(() => dateType === DATE_TYPES.RANGE ? {
        startDate,
        endDate,
        selectsRange: true,
        onChange: (dates = []) => {
            const [start, end] = dates;
            const normalizedStart = startOfDay(start);
            const daysDiff = differenceInDays(normalizedStart, initialDate);
            const adjustedDays = Math.min(MAX_ALLOWED_DAYS, daysDiff);
            const minDate = subDays(normalizedStart, adjustedDays + 1);
            setMinDate(minDate);
            setMaxDate(addDays(normalizedStart, MAX_ALLOWED_DAYS));
            setStartDate(normalizedStart);
            setViewMonth(prev => differenceInMonths(normalizedStart, prev) > 1 ? normalizedStart: prev);
            if(differenceInDays(startDate,normalizedStart) > 0) {
                const normalizedEnd = startOfDay(startDate);
                const daysDiff = differenceInDays(normalizedEnd, normalizedStart);
                const plusDays = Math.floor(daysDiff / 2);
                const additionalDays = daysDiff + 1;
                setPlusDays(plusDays);
                setAdditionalDays(additionalDays);
                setMiddleDate(addDays(normalizedStart,plusDays));
                setEndDate(normalizedEnd);
                setMinDate(initialDate);
                setMaxDate(addYears(initialDate, 1));
                confirmDates({ plusDays, additionalDays, rawDate: normalizedStart });
            } else if (end) {
                const normalizedEnd = startOfDay(end);
                const daysDiff = differenceInDays(normalizedEnd, normalizedStart);
                const plusDays = Math.floor(daysDiff > 1 ? daysDiff / 2: daysDiff);
                const additionalDays = daysDiff + 1;
                setPlusDays(plusDays);
                setAdditionalDays(additionalDays);
                setMiddleDate(addDays(normalizedStart,plusDays));
                setEndDate(normalizedEnd);
                setMinDate(initialDate);
                setMaxDate(addYears(initialDate, 1));
                confirmDates({ plusDays, additionalDays, rawDate: normalizedStart });
            } else {
                setEndDate(null);
            }
        }
    }: {
        onChange: date => handleChangeDateType({ date, plusDays }),
        highlightDates
    },[dateType,startDate,endDate,highlightDates,plusDays,isMobile]);

    const dateTypesList = useMemo(() => [
        {
            name: intl.formatMessage({ id: 'mainform.multiple-datepicker.types.date' }),
            value: DATE_TYPES.DATE
        },
        {
            name: intl.formatMessage({ id: 'mainform.multiple-datepicker.types.range' }),
            value: DATE_TYPES.RANGE
        },
    ],[locale]);

    const plusDaysList = useMemo(() => [
        {
            name: `± 1 ${intl.formatMessage({ id: 'common.day1' })}`,
            value: ALLOWED_PLUS_MINUS_DAYS[0]
        },
        {
            name: `± 3 ${intl.formatMessage({ id: 'common.day2' })}`,
            value: ALLOWED_PLUS_MINUS_DAYS[1]
        },
        {
            name: `± 7 ${intl.formatMessage({ id: 'common.day5' })}`,
            value: ALLOWED_PLUS_MINUS_DAYS[2]
        },
    ],[locale]);


    const closeModalHandler = () => {
        if (isMobile) {
            enableScroll(BODY);
        }
        setModalIsOpen('');
    };

    registerLocale('ru', ru);
    registerLocale('uk', uk);
    setDefaultLocale(locale);

    const confirmDates = ({ rawDate, plusDays, additionalDays }) => {
        selectedDate({ rawDate, plusDays, additionalDays, dateType });
    }

    const selectedHandler = () => {
        confirmDates({ rawDate: startDate, plusDays, additionalDays });
        if (isMobile) {
            enableScroll(BODY);
        }
        setModalIsOpen('');
    };

    const handleDateType = type => {
        selectedDate({ rawDate: startDate, plusDays, additionalDays, dateType: type });
    }
    return (
        <div className={`${styles.popup_container}`} ref={wrapperRef}>
            <Header closeModalHandler={closeModalHandler} svg={svgDate} />
            <h3 className={`title ${styles.popup_title}`}>{popupName}</h3>
            <div className={`${styles.popup_nav}`}>
                <button onClick={() => datepickerHandlers.current.decreaseMonth()} dangerouslySetInnerHTML={{__html: svgPrev}} className={`${styles.popup_nav_btn}`} />
                <SwitchMenu
                    items={dateTypesList}
                    name={'date_types_switcher'}
                    callback={[dateType, handleDateType]}
                />
                <button onClick={() => datepickerHandlers.current.increaseMonth()} dangerouslySetInnerHTML={{__html: svgNext}} className={`${styles.popup_nav_btn}`} />
            </div>
            <div className={`${styles.popup_datepicker}`}>
                <DatePicker
                    {...datePickerProps}
                    showPopperArrow={false}
                    minDate={minDate}
                    maxDate={maxDate}
                    monthsShown={isMobile ? 1: 2}
                    inline
                    selected={viewMonth}
                    disabledKeyboardNavigation
                    onDayMouseEnter={(date) => setHoveredDate(date)}
                    dayClassName={(date) => {
                        if(dateType === DATE_TYPES.DATE) return;
                        if (startDate && !endDate && hoveredDate) {
                            const rangeStart = isBefore(hoveredDate, startDate) ? hoveredDate : startDate;
                            const rangeEnd = isBefore(hoveredDate, startDate) ? startDate : hoveredDate;
                            if (
                                isWithinInterval(date, {
                                    start: startOfDay(rangeStart),
                                    end: endOfDay(rangeEnd),
                                }) &&
                                !isBefore(date, minDate)
                            ) {
                                return 'react-datepicker__day--in-range';
                            }
                        }

                        return undefined;
                    }}
                    renderCustomHeader={({
                         monthDate,
                         decreaseMonth,
                         increaseMonth,
                    }) => {
                        datepickerHandlers.current = {
                            decreaseMonth,
                            increaseMonth,
                            monthDate
                        };
                        return (
                            <div className="react-datepicker__custom-header">
                                <button onClick={decreaseMonth} dangerouslySetInnerHTML={{__html: svgPrev}} className={`${styles.popup_nav_btn}`} />
                                <span className="react-datepicker__current-month">{monthDate.toLocaleString(locale, {
                                    month: "long",
                                })}
                            </span>
                                <button onClick={increaseMonth}  dangerouslySetInnerHTML={{__html: svgNext}} className={`${styles.popup_nav_btn}`} />
                            </div>
                        )
                    }}
                />
            </div>
            <div className={`${styles.popup_footer}`}>
                {
                    dateType === DATE_TYPES.DATE ? (
                        <div className={`${styles.popup_plus_days_list}`}>
                            {
                                plusDaysList.map(({name,value}) => (
                                    <button className={`${styles.popup_plus_days_btn} ${value === plusDays && activePlusDay === value ? 'active': ''}`} key={value} onClick={() => {
                                        setPlusDays(prev => prev !== value ? value: 0);
                                        setActivePlusDay(prev => prev !== value ? value: 0);
                                        handleChangeDateType({
                                            date: middleDate,
                                            plusDays: activePlusDay !== value  ? value: 0
                                        });
                                    }}>
                                        {name}
                                    </button>
                                ))
                            }
                        </div>
                    ): <div/>
                }
                <button className={`${styles.popup_apply}`} onClick={selectedHandler}>
                    <FM id="common.apply" />
                </button>
            </div>
            <DatePickerGlobalStyle />
        </div>

    )
}

export default MultipleDatepicker;