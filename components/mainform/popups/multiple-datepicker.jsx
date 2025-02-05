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
    addMonths,
    differenceInDays, format,
    isAfter,
    isSameDay,
    isSameMonth,
    startOfDay,
    subDays,
    subMonths
} from 'date-fns';
import { addYears, addDays } from 'date-fns';
import { useRouter } from "next/router";
import useOutsideClick from "../../../utils/clickOutside";
import { FormattedMessage as FM, useIntl } from "react-intl";

import { svgDate, svgNext, svgPrev } from "../form-fields/svg";
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker';
import Header from "./header";
import DatePickerGlobalStyle from "../../../styles/datePickerGlobalStyle";
import SwitchMenu from "../../common/switchMenu/switchMenu";
import SimpleBar from "simplebar-react";

import ru from 'date-fns/locale/ru';
import uk from 'date-fns/locale/uk';

import styles from "./multiple-datepicker.module.css";

const DATE_TYPES = {
    DATE: 'date',
    RANGE: 'range'
}

const calcDateTypeHandler = ({ date, plusDays = 0, initialDate}) => {
    let startDate, calculatedAdditionalDays = 0, middleDate;
    const normalizedDate = startOfDay(date);
    const normalizedInitialDate = startOfDay(initialDate);
    if (isSameDay(normalizedDate,  normalizedInitialDate)) {
        startDate =  normalizedInitialDate;
        calculatedAdditionalDays = plusDays;
        middleDate = normalizedInitialDate;
    } else if (isAfter(normalizedDate, normalizedInitialDate)) {
        const daysBefore = Math.min(differenceInDays(normalizedDate, normalizedInitialDate), Math.min(plusDays, differenceInDays(normalizedDate, normalizedInitialDate)));
        const daysAfter = plusDays;
        startDate = subDays(normalizedDate, daysBefore);
        calculatedAdditionalDays  = daysBefore + daysAfter + 1;
        middleDate = normalizedDate;
    }
    return {
        newStartDate: startDate,
        newEndDate: addDays(startDate, calculatedAdditionalDays),
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
    const storeDate = useMemo(() => date.rawDate,[date]);
    const initialPlusDays = useMemo(() => date.plusDays,[date]);
    const initialAddPlusDays = useMemo(() => date.additionalDays,[date]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [middleDate, setMiddleDate] = useState(null);
    const [plusDays, setPlusDays] = useState(0);
    const [activePlusDay, setActivePlusDay] = useState(0);
    const [additionalDays, setAdditionalDays] = useState(0);
    const [dateType, setDateType] = useState(DATE_TYPES.DATE);
    const [viewMonth, setViewMonth] = useState(initialDate);

    useEffect(() => {
        setPlusDays(initialPlusDays);
        setActivePlusDay(initialPlusDays);
        setAdditionalDays(initialAddPlusDays);
        const { newStartDate, newEndDate, newMiddleDate } = calcDateTypeHandler({
            date: startOfDay(storeDate),
            plusDays: initialPlusDays,
            initialDate
        });
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setMiddleDate(newMiddleDate);
    }, []);

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

    const handleChangeDateType = ({date, plusDays = 0}) => {
        const { newStartDate, newEndDate, newMiddleDate, calculatedAdditionalDays } = calcDateTypeHandler({
            date,
            plusDays,
            initialDate
        });
        setStartDate(newStartDate);
        setEndDate(newEndDate);
        setAdditionalDays(calculatedAdditionalDays);
        setMiddleDate(newMiddleDate);
        setViewMonth(!isSameMonth(newStartDate, newMiddleDate) ? newStartDate: newEndDate);

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
            setStartDate(normalizedStart);
            setViewMonth(normalizedStart);
            if (end) {
                const normalizedEnd = startOfDay(end);
                let daysDiff = differenceInDays(normalizedEnd, normalizedStart) + 1;

                if (daysDiff > 7) {
                    daysDiff = 7;
                }

                const finalEndDate = addDays(normalizedStart, daysDiff - 1);
                setPlusDays(daysDiff);
                setAdditionalDays(daysDiff);
                setEndDate(finalEndDate);
                confirmDates({ plusDays: daysDiff, additionalDays: daysDiff, rawDate: normalizedStart });
            } else {
                setEndDate(null);
            }
        }
    }: {
        onChange: date => handleChangeDateType({ date, plusDays }),
        highlightDates
    },[dateType,startDate,endDate,highlightDates,plusDays]);

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
            value: 1
        },
        {
            name: `± 3 ${intl.formatMessage({ id: 'common.day2' })}`,
            value: 3
        },
        {
            name: `± 7 ${intl.formatMessage({ id: 'common.day5' })}`,
            value: 7
        },
    ],[locale]);

    const isMobile = useMemo(() => size.width < maxWidth,[size]);

    useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
    useSetBodyScroll(modalIsOpen, maxWidth, size.width);


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
        selectedDate({ rawDate, plusDays, additionalDays });
    }

    const selectedHandler = () => {
        confirmDates({ rawDate: startDate, plusDays, additionalDays });
        if (isMobile) {
            enableScroll(BODY);
        }
        setModalIsOpen('');
    };

    const navHandler = (isPrev = false) => {
        setViewMonth((prevDate) => isPrev ? subMonths(prevDate, 1) : addMonths(prevDate, 1));
    }

    return (
        <div className={`${styles.popup_container}`} ref={wrapperRef}>
            <Header closeModalHandler={closeModalHandler} svg={svgDate} />
            <h3 className="title">{popupName}</h3>
            <div className={`${styles.popup_nav}`}>
                <button onClick={() => navHandler(true)} dangerouslySetInnerHTML={{__html: svgPrev}} className={`${styles.popup_nav_btn}`} />
                <SwitchMenu
                    items={dateTypesList}
                    name={'date_types_switcher'}
                    callback={[dateType, setDateType]}
                />
                <button onClick={() => navHandler(false)} dangerouslySetInnerHTML={{__html: svgNext}} className={`${styles.popup_nav_btn}`} />
            </div>
            <div className={`${styles.popup_datepicker}`}>
                <DatePicker
                    {...datePickerProps}
                    showPopperArrow={false}
                    minDate={initialDate}
                    maxDate={addYears(initialDate, 1)}
                    monthsShown={isMobile ? 1: 2}
                    inline
                    selected={viewMonth}
                    onMonthChange={setViewMonth}
                    disabledKeyboardNavigation
                    renderCustomHeader={({
                                             monthDate,
                         decreaseMonth,
                         increaseMonth,
                         prevMonthButtonDisabled,
                         nextMonthButtonDisabled,
                    }) => (
                        <div className="react-datepicker__custom-header">
                            <button onClick={decreaseMonth} disabled={prevMonthButtonDisabled} dangerouslySetInnerHTML={{__html: svgPrev}} className={`${styles.popup_nav_btn}`} />
                            <span className="react-datepicker__current-month">{monthDate.toLocaleString(locale, {
                                month: "long",
                            })}
                            </span>
                            <button onClick={increaseMonth} disabled={nextMonthButtonDisabled} dangerouslySetInnerHTML={{__html: svgNext}} className={`${styles.popup_nav_btn}`} />
                        </div>
                    )}
                />
            </div>
            <div className={`${styles.popup_footer}`}>
                {
                    dateType === DATE_TYPES.DATE ? (
                        <div className={`${styles.popup_plus_days_list}`}>
                            {
                                plusDaysList.map(({name,value}) => (
                                    <button className={`${styles.popup_plus_days_btn} ${value === plusDays && activePlusDay === value ? 'active': ''}`} key={value} onClick={() => {
                                        setPlusDays(value);
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