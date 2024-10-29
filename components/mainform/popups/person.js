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
import { useGetPerson, useSetPerson, useSetModal } from '../../../store/store';
import SimpleBar from 'simplebar-react';
import InfoSvg from '../../common/infoSvg';
import { FormattedMessage as FM, useIntl } from 'react-intl';

const covertStoreAgesToComponent = (ages) => {
  return ages.map(age => ({key: String(Math.random()), age}));
};

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
  const [isAgeSelectorShown, setIsAgeSelectorShown] = useState(false);
  const [childrenAges, setChildrenAges] = useState(
    covertStoreAgesToComponent(initialPerson.childAge)
  );

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
    if (operation === '+') {
      setAdult((prev) => prev + 1);
    } else {
      setAdult((prev) => prev - 1);
    }
  };

  const selectedHandler = () => {
    const childAge = childrenAges.map(ageObject => ageObject.age);
    const newPerson = { adult, child: childrenAges.length, childAge };
    selectedPerson(newPerson);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  const setCurrentChildAge = (event) => {
    const age = parseInt(event.target.value, 10);
    const newChild = { key: String(Math.random()), age };
    const newChildAge = [...childrenAges, newChild];

    setIsAgeSelectorShown(false);
    setChildrenAges(newChildAge);
  };

  const dropChild = (key) => {
    const index = childrenAges.findIndex(ageObject => ageObject.key === key);
    const newChildrenAges = childrenAges.slice(0);

    newChildrenAges.splice(index, 1);

    setChildrenAges(newChildrenAges);
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

          <div className={`${styles.night_input_wrapper} ${styles.children_details_container}`}>
            {childrenAges.length > 0 && (
              <>
                {/* header */}
                <label htmlFor="child">
                  <button
                    className={styles.info_btn}
                    onClick={() => setModal(childTxt)}
                  >
                    <FM id="mainform.person.child" />
                    <InfoSvg />
                  </button>
                </label>

                {/* selected children */}
                <div className={styles.chosen_ages}>
                  {childrenAges.map(ageObject => (
                    <button
                      key={ageObject.key}
                      onClick={() => dropChild(ageObject.key)}
                      className="svg_btn_stroke"
                    >
                      <FM id="mainform.person.child_age" values={{age: ageObject.age}} />
                      <div className={styles.close_svg_clipper}>
                        <CloseSvg />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* add children button */}
            {(!isAgeSelectorShown && childrenAges.length < valRange.childMax) && (
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
                <div
                  className={styles.age_selector}
                  onClick={setCurrentChildAge}
                >
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

        <div className="apply_btn_wrapper">
          <button className="apply_btn" onClick={selectedHandler}>
            <FM id="common.apply" />
          </button>
        </div>
      </div>
    </SimpleBarWrapper>
  );
}
