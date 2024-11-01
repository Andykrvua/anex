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
import CloseSvg from 'components/common/closeSvg';
import { mainFormPersonValidationRange as valRange } from '../../../utils/constants';
import { useGetPerson, useSetPerson, useSetModal, useGetFieldsNames } from '../../../store/store';
import SimpleBar from 'simplebar-react';
import InfoSvg from '../../common/infoSvg';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { covertStoreAgesToComponent } from '../../../utils/customer-crew';

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

export default function Person({ setModalIsOpen, modalIsOpen, cName }) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const fieldsNames = useGetFieldsNames();
  const initialPerson = useGetPerson();
  const selectedPerson = useSetPerson();
  const setModal = useSetModal();

  const intl = useIntl();
  const childTxt = intl.formatMessage({
    id: 'mainform.person.child.modal',
  });

  const [isAgeSelectorShown, setIsAgeSelectorShown] = useState(false);
  const [childrenAges, setChildrenAges] = useState(covertStoreAgesToComponent(initialPerson.childAge));

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

  const updateFieldsPerson = (operation) => {
    const newAdult = initialPerson.adult + (operation === '+' ? 1 : -1);
    selectedPerson({ ...initialPerson, adult: newAdult });
  };

  const selectedHandler = () => {
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  const setCurrentChildAge = (event) => {
    const age = parseInt(event.target.value, 10);

    if (Number.isNaN(age)) return;

    const newChild = { key: String(Math.random()), age };
    const newChildAge = [...childrenAges, newChild];

    setIsAgeSelectorShown(false);
    setValues(newChildAge);
  };

  const dropChild = (key) => {
    const index = childrenAges.findIndex((ageObject) => ageObject.key === key);
    const newChildrenAges = childrenAges.slice(0);

    newChildrenAges.splice(index, 1);
    setValues(newChildrenAges);
  };

  const setValues = (newChildrenAges) => {
    setChildrenAges(newChildrenAges);
    selectedPerson({
      ...initialPerson,
      child: newChildrenAges.length,
      childAge: newChildrenAges.map((ageObject) => ageObject.age),
    });
  };

  return (
    <SimpleBarWrapper size={size}>
      <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
        <Header closeModalHandler={closeModalHandler} svg={svgPerson} />
        <h3 className="title">{fieldsNames.person}</h3>
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
              value={initialPerson.adult}
            />
            <button
              className={`${styles.plus_minus_btn} ${styles.minus_btn}`}
              onClick={() => updateFieldsPerson('-')}
              disabled={initialPerson.adult === valRange.adultMin}
            >
              <SvgMinus />
            </button>
            <button
              className={`${styles.plus_minus_btn} ${styles.plus_btn}`}
              onClick={() => updateFieldsPerson('+')}
              disabled={initialPerson.adult === valRange.adultMax}
            >
              <SvgPlus />
            </button>
          </div>

          <div className={`${styles.night_input_wrapper} ${styles.children_details_container}`}>
            {childrenAges.length > 0 && (
              <>
                {/* header */}
                <label htmlFor="child">
                  <FM id="mainform.person.child" />
                  {/* <button className={styles.info_btn} onClick={() => setModal(childTxt)}>
                    <FM id="mainform.person.child" />
                    <InfoSvg />
                  </button> */}
                </label>

                {/* selected children */}
                <div className={styles.chosen_ages}>
                  {childrenAges.map((ageObject) => (
                    <button
                      key={ageObject.key}
                      onClick={() => dropChild(ageObject.key)}
                      className="svg_btn_stroke"
                    >
                      <FM id="mainform.person.child_age" values={{ age: ageObject.age }} />
                      <div className={styles.close_svg_clipper}>
                        <CloseSvg />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* add children button */}
            {!isAgeSelectorShown && childrenAges.length < valRange.childMax && (
              <button
                className={`apply_btn ${styles.add_children_button}`}
                onClick={() => setIsAgeSelectorShown(true)}
              >
                <FM id="mainform.person.add_children" />
              </button>
            )}

            {/* age selector */}
            {isAgeSelectorShown && (
              <>
                <div className={styles.age_q}>
                  <FM id="mainform.person.whats_age" />
                </div>
                <div className={styles.age_selector} onClick={setCurrentChildAge}>
                  <button value="1">
                    <FM id="mainform.person.child_age_till_2" />
                  </button>
                  <button value="2">2</button>
                  <button value="3">3</button>
                  <button value="4">4</button>
                  <button value="5">5</button>
                  <button value="6">6</button>
                  <button value="7">7</button>
                  <button value="8">8</button>
                  <button value="9">9</button>
                  <button value="10">10</button>
                  <button value="11">11</button>
                  <button value="12">12</button>
                  <button value="13">13</button>
                  <button value="14">14</button>
                  <button value="15">15</button>
                  <button value="16">16</button>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="apply_btn_wrapper apply_btn_mobile_only_wrapper">
          <button className="apply_btn" onClick={selectedHandler}>
            <FM id="common.apply" />
          </button>
        </div>
      </div>
    </SimpleBarWrapper>
  );
}
