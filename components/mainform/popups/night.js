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
import { mainFormNightValidationRange as valRange } from '../../../utils/constants';
import SvgPlus from 'components/svgPlus';
import SvgMinus from 'components/svgMinus';
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

  const [fromNight, setFromNight] = useState(defaultNight.from);
  const [toNight, setToNight] = useState(defaultNight.to);

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

  function validate(str, min, max) {
    return str >= min && str <= max;
  }

  const onClick = (operation, input) => {
    if (operation === '+') {
      if (input === 'from') {
        setFromNight((prev) => prev + 1);
        if (fromNight + 3 > toNight) {
          setToNight((prev) => prev + 1);
        }
      } else {
        setToNight((prev) => prev + 1);
      }
    } else {
      if (input === 'to') {
        setToNight((prev) => prev - 1);
        if (toNight - 3 < fromNight) {
          setFromNight((prev) => prev - 1);
        }
      } else {
        setFromNight((prev) => prev - 1);
      }
    }
  };

  const inputFromOnchange = (val) => {
    if (isNaN(parseInt(val))) {
      setFromNight(valRange.defaultFrom);
      setToNight(valRange.defaultTo);
    } else {
      setFromNight(parseInt(val));
    }
  };

  const inputToOnchange = (val) => {
    if (isNaN(parseInt(val))) {
      setFromNight(valRange.defaultFrom);
      setToNight(valRange.defaultTo);
    } else {
      setToNight(parseInt(val));
    }
  };

  const inputFromOnblur = (val) => {
    if (validate(val, valRange.fromMin, valRange.fromMax)) {
      setFromNight(parseInt(val));
    } else {
      setFromNight(valRange.defaultFrom);
      setToNight(valRange.defaultTo);
    }
  };

  const inputToOnblur = (val) => {
    if (validate(val, valRange.toMin, valRange.toMax)) {
      setToNight(parseInt(val));
    } else {
      setFromNight(valRange.defaultFrom);
      setToNight(valRange.defaultTo);
    }
  };

  const selectedHandler = () => {
    const newNight = { from: fromNight, to: toNight };
    selectedNight(newNight);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgNight} />
      <h3 className="title">{popupName}</h3>
      <div
        className={`${styles.popup_scrollable_content} popup_scrollable_content`}
        ref={scrollable}
      >
        <div className={styles.night_input_wrapper}>
          <label htmlFor="fromNight">
            <FM id="mainform.night.from" />
          </label>
          <input
            className={styles.night_input}
            id="fromNight"
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={fromNight}
            onChange={(e) => inputFromOnchange(e.target.value)}
            onBlur={(e) => inputFromOnblur(e.target.value)}
          />
          <button
            className={`${styles.plus_minus_btn} ${styles.minus_btn}`}
            onClick={() => onClick('-', 'from')}
            disabled={fromNight === valRange.fromMin}
          >
            <SvgMinus />
          </button>
          <button
            className={`${styles.plus_minus_btn} ${styles.plus_btn}`}
            onClick={() => onClick('+', 'from')}
            disabled={fromNight === valRange.fromMax}
          >
            <SvgPlus />
          </button>
        </div>
        <div className={styles.night_input_wrapper}>
          <label htmlFor="toNight">
            <FM id="mainform.night.to" />
          </label>
          <input
            className={styles.night_input}
            type="text"
            id="toNight"
            inputMode="numeric"
            pattern="[0-9]*"
            value={toNight}
            onChange={(e) => inputToOnchange(e.target.value)}
            onBlur={(e) => inputToOnblur(e.target.value)}
          />
          <button
            className={`${styles.plus_minus_btn} ${styles.minus_btn}`}
            onClick={() => onClick('-', 'to')}
            disabled={toNight === valRange.toMin}
          >
            <SvgMinus />
          </button>
          <button
            className={`${styles.plus_minus_btn} ${styles.plus_btn}`}
            onClick={() => onClick('+', 'to')}
            disabled={toNight === valRange.toMax}
          >
            <SvgPlus />
          </button>
        </div>
        <span className={styles.nights_count}>
          <FM id="mainform.night.from" /> <b>{parseInt(fromNight)}</b>{' '}
          <span className="tolower">
            <FM id="mainform.night.to" />
          </span>{' '}
          <b>{parseInt(toNight)}</b> ночей
        </span>
        <span className={styles.days_count}>
          ({parseInt(fromNight) + 1} - {parseInt(toNight) + 1}{' '}
          <FM id="common.day5" />)
        </span>
      </div>
      <div className="apply_btn_wrapper">
        <button className="apply_btn" onClick={selectedHandler}>
          <FM id="common.apply" />
        </button>
      </div>
    </div>
  );
}
