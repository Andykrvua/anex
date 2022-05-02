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
import { svgPerson } from '../form-fields/svg';
import styles from './person.module.css';
import SvgPlus from 'components/svgPlus';
import SvgMinus from 'components/svgMinus';
import { mainFormPersonValidationRange as valRange } from '../../../utils/constants';

export default function Person({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
}) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const [adult, setAdult] = useState(2);
  const [child, setChild] = useState(0);

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

  const ChildAge = () => {
    const [childAge, setChildAge] = useState(new Array(child).fill(0));
    // console.log(childAge);
    const updateField = (index, operator) => {
      let newArr = [...childAge];
      if (operator === '+') {
        newArr[index] = newArr[index] + 1;
      } else {
        newArr[index] = newArr[index] - 1;
      }
      setChildAge(newArr);
    };
    return (
      <>
        <label>Возраст</label>
        {[...new Array(child).fill(0)].map((_, i) => {
          return (
            <div className={styles.night_input_wrapper} key={_ + i}>
              <input
                className={styles.night_input}
                type="text"
                // disabled
                value={childAge[i]}
                onChange={() => {
                  return null;
                }}
              />
              <button
                className={`${styles.plus_minus_btn} ${styles.minus_btn}`}
                onClick={() => updateField(i, '-')}
                disabled={childAge[i] + 1 === valRange.childAgeMin}
              >
                <SvgMinus />
              </button>
              <button
                className={`${styles.plus_minus_btn} ${styles.plus_btn}`}
                onClick={() => updateField(i, '+')}
                disabled={childAge[i] === valRange.childAgeMax}
              >
                <SvgPlus />
              </button>
            </div>
          );
        })}
      </>
    );
  };

  const onClick = (operation, input) => {
    if (operation === '+') {
      if (input === 'adult') {
        setAdult((prev) => prev + 1);
      } else {
        setChild((prev) => prev + 1);
      }
    } else {
      if (input === 'child') {
        setChild((prev) => prev - 1);
      } else {
        setAdult((prev) => prev - 1);
      }
    }
  };
  console.log(child);
  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeModalHandler} svg={svgPerson} />
      <h3 className="title">{popupName}</h3>
      <div className="popup_scrollable_content" ref={scrollable}>
        <div className={styles.night_input_wrapper}>
          <label htmlFor="adult">Взрослые</label>
          <input
            className={styles.night_input}
            id="adult"
            type="text"
            disabled
            value={adult}
          />
          <button
            className={`${styles.plus_minus_btn} ${styles.minus_btn}`}
            onClick={() => onClick('-', 'adult')}
            disabled={adult === valRange.adultMin}
          >
            <SvgMinus />
          </button>
          <button
            className={`${styles.plus_minus_btn} ${styles.plus_btn}`}
            onClick={() => onClick('+', 'adult')}
            disabled={adult === valRange.adultMax}
          >
            <SvgPlus />
          </button>
        </div>
        <div className={styles.night_input_wrapper}>
          <label htmlFor="child">Дети</label>
          <input
            className={styles.night_input}
            type="text"
            id="child"
            disabled
            value={child}
          />
          <button
            className={`${styles.plus_minus_btn} ${styles.minus_btn}`}
            onClick={() => onClick('-', 'child')}
            disabled={child === valRange.childMin}
          >
            <SvgMinus />
          </button>
          <button
            className={`${styles.plus_minus_btn} ${styles.plus_btn}`}
            onClick={() => onClick('+', 'child')}
            disabled={child === valRange.childMax}
          >
            <SvgPlus />
          </button>
        </div>
        {child ? <ChildAge /> : null}
      </div>
      <div className="apply_btn_wrapper">
        <button className="apply_btn" onClick={closeModalHandler}>
          Применить
        </button>
      </div>
    </div>
  );
}
