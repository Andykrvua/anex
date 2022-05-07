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
import { useGetPerson, useSetPerson, useSetModal } from '../../../store/store';
import SimpleBar from 'simplebar-react';
import InfoSvg from '../../common/infoSvg';
import { FormattedMessage as FM, useIntl } from 'react-intl';

// change scroll depending on mobile or desktop
const SimpleBarWrapper = ({ size, children }) => {
  return (
    <>
      {size.width >= maxWidth ? (
        <SimpleBar
          className="mobile_default"
          style={{ maxHeight: 'var(--mainform-desktop-maxheight)' }}
          autoHide={true}
        >
          {children}
        </SimpleBar>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default function Person({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
}) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const initialPerson = useGetPerson();
  const selectedPerson = useSetPerson();
  const setModal = useSetModal();

  const intl = useIntl();
  const childTxt = intl.formatMessage({
    id: 'mainform.person.child.modal',
  });

  const [adult, setAdult] = useState(initialPerson.adult);
  const [child, setChild] = useState(initialPerson.child);
  const [childAge, setChildAge] = useState(initialPerson.childAge);

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
    const updateFieldsAge = (index, operator) => {
      const newArr = [...childAge];
      if (operator === '+') {
        newArr[index] = newArr[index] + 1;
      } else {
        newArr[index] = newArr[index] - 1;
      }
      setChildAge(newArr);
    };
    return (
      <>
        <label className={styles.age_label}>
          <FM id="mainform.person.age" />
        </label>
        {[...new Array(child).fill(0)].map((_, i) => {
          return (
            <div
              className={`${styles.night_input_wrapper} ${styles.night_input_age_wrapper}`}
              key={_ + i}
            >
              <input
                className={styles.night_input}
                type="text"
                disabled
                value={childAge[i]}
                onChange={() => {
                  return null;
                }}
              />
              <button
                className={`${styles.plus_minus_btn} ${styles.minus_btn}`}
                onClick={() => updateFieldsAge(i, '-')}
                disabled={childAge[i] + 1 === valRange.childAgeMin}
              >
                <SvgMinus />
              </button>
              <button
                className={`${styles.plus_minus_btn} ${styles.plus_btn}`}
                onClick={() => updateFieldsAge(i, '+')}
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

  const updateFieldsPerson = (operation, input) => {
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

  const selectedHandler = () => {
    const newPerson = { adult, child, childAge };
    selectedPerson(newPerson);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  return (
    <SimpleBarWrapper size={size}>
      <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
        <Header closeModalHandler={closeModalHandler} svg={svgPerson} />
        <h3 className="title">{popupName}</h3>
        <div className="popup_scrollable_content" ref={scrollable}>
          <div className={styles.night_input_wrapper}>
            <label htmlFor="adult">
              <FM id="mainform.person.adult" />
            </label>
            <input
              className={styles.night_input}
              id="adult"
              type="text"
              disabled
              value={adult}
            />
            <button
              className={`${styles.plus_minus_btn} ${styles.minus_btn}`}
              onClick={() => updateFieldsPerson('-', 'adult')}
              disabled={adult === valRange.adultMin}
            >
              <SvgMinus />
            </button>
            <button
              className={`${styles.plus_minus_btn} ${styles.plus_btn}`}
              onClick={() => updateFieldsPerson('+', 'adult')}
              disabled={adult === valRange.adultMax}
            >
              <SvgPlus />
            </button>
          </div>
          <div className={styles.night_input_wrapper}>
            <label htmlFor="child">
              <button
                className={styles.info_btn}
                onClick={() => setModal(childTxt)}
              >
                <FM id="mainform.person.child" />
                <InfoSvg />
              </button>
            </label>
            <input
              className={styles.night_input}
              type="text"
              id="child"
              disabled
              value={child}
            />
            <button
              className={`${styles.plus_minus_btn} ${styles.minus_btn}`}
              onClick={() => updateFieldsPerson('-', 'child')}
              disabled={child === valRange.childMin}
            >
              <SvgMinus />
            </button>
            <button
              className={`${styles.plus_minus_btn} ${styles.plus_btn}`}
              onClick={() => updateFieldsPerson('+', 'child')}
              disabled={child === valRange.childMax}
            >
              <SvgPlus />
            </button>
          </div>
          {child ? <ChildAge /> : null}
        </div>
        <div className="apply_btn_wrapper">
          <button className="apply_btn" onClick={selectedHandler}>
            <FM id="common.apply" />
          </button>
        </div>
      </div>
    </SimpleBarWrapper>
  );
}
