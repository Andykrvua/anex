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
import Header from '../../mainform/popups/header';
import { svgPerson } from '../../mainform/form-fields/svg';
import styles from '../../mainform/popups/person.module.css';
import SvgPlus from 'components/svgPlus';
import SvgMinus from 'components/svgMinus';
import { mainFormPersonValidationRange as valRange } from '../../../utils/constants';
import { useSetModal, useGetOfferParams } from 'store/store';
import SimpleBar from 'simplebar-react';
import InfoSvg from '../../common/infoSvg';
import CloseSvg from 'components/common/closeSvg';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import Loader from 'components/common/loader';
import { useRouter } from 'next/router';
import {
  covertStoreAgesToComponent,
  parseCrewComposition,
  stringifyCrewComposition
} from '../../../utils/customer-crew';

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

export default function Person({ closeHandler }) {
  const [loading, setLoading] = useState(false);
  const [resMessage, setResMessage] = useState('');

  const router = useRouter();
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const setModal = useSetModal();
  const getOfferParams = useGetOfferParams();

  const intl = useIntl();
  const childTxt = intl.formatMessage({
    id: 'mainform.person.child.modal',
  });

  const { adult: _adult, childAge: _childAge } = parseCrewComposition(
    getOfferParams.people
  );

  const [isAgeSelectorShown, setIsAgeSelectorShown] = useState(false);
  const [adult, setAdult] = useState(_adult);
  const [childAge, setChildAge] = useState(covertStoreAgesToComponent(_childAge));

  useOutsideClick(wrapperRef);
  useSetBodyScroll(maxWidth, size.width);

  useEffect(() => {
    if (size.width < maxWidth) {
      disableScroll(scrollable.current);
    }
    return () => {
      clear();
    };
  }, [size.width]);

  const updateFieldsPerson = (operation) => {
    setResMessage('');
    setAdult(adult + (operation === '+' ? 1 : -1));
  };

  const selectedHandler = () => {
    setResMessage('');
    const newPerson = { adult, child: childAge.length, childAge };
    checkVariants(newPerson);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
  };

  const setCurrentChildAge = (event) => {
    const age = parseInt(event.target.value, 10);

    if (Number.isNaN(age)) return;

    const newChild = { key: String(Math.random()), age };
    const newChildAge = [...childAge, newChild];

    setIsAgeSelectorShown(false);
    setChildAge(newChildAge)
  };

  const dropChild = (key) => {
    const index = childAge.findIndex(ageObject => ageObject.key === key);
    const newChildAge = childAge.slice(0);

    newChildAge.splice(index, 1);
    setChildAge(newChildAge)
  };

  const checkVariants = async (newPerson) => {
    setLoading(true);

    const postData = {
      from: getOfferParams.from,
      to: getOfferParams.hotelId,
      transport: getOfferParams.transport,
      checkIn: getOfferParams.checkIn,
      checkTo: getOfferParams.checkTo,
      nights: getOfferParams.nights,
      nightsTo: getOfferParams.nightsTo,
      people: stringifyCrewComposition(newPerson),
    };

    const search = await fetch(`/api/endpoints/isOfferSearchVariants/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(postData),
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    });

    if (search?.ok) {
      setLoading(false);
      if (search.data.total) {
        ResultHandler(search.data.results);
      } else {
        setResMessage(
          'В этом отеле нет предложений для заданного числа туристов. Попробуйте выбрать другую дату или изменить длительность тура'
        );
      }
    } else {
      setLoading(false);
      /* eslint-disable-next-line */
      console.log('api bad res');
    }
  };

  const ResultHandler = (apiData) => {
    const resultData = [];

    const { dateStart, food, nightCount } = getOfferParams;

    // parse api res from create array and find the same food, daystart, night count
    Object.entries(apiData).forEach(([operatorId, value]) => {
      Object.entries(value).forEach(([hotelId, data]) => {
        Object.entries(data.offers).forEach(([offerId, offerValue]) => {
          if (
            offerValue.fn === food &&
            offerValue.d === dateStart &&
            offerValue.nh === nightCount
          ) {
            resultData.push(offerValue);
          }
        });
      });
    });

    // find the same food and sort min price
    const sortedData = resultData.sort((a, b) => a.pl - b.pl);
    if (sortedData.length) {
      changeOffer(sortedData[0]);
    } else {
      setResMessage(
        'В этом отеле нет предложений с вашими параметрами для заданного числа туристов. Попробуйте выбрать другую дату, длительность тура или изменить параметры питания'
      );
    }
  };

  const changeOffer = (offer) => {
    const locale = router.locale === 'ru' ? '' : `/${router.locale}`;
    const newPerson = { adult, child: childAge.length, childAge };
    const people = stringifyCrewComposition(newPerson);

    const newUrl = `${locale}/hotels/${getOfferParams.country}/${getOfferParams.hotel}/?offer=${offer.i}&transport=${offer.t}&from=${getOfferParams.from}&fromname=${getOfferParams.fromname}&to=${getOfferParams.to}&checkIn=${getOfferParams.checkIn}&checkTo=${getOfferParams.checkTo}&nights=${getOfferParams.nights}&nightsTo=${getOfferParams.nightsTo}&people=${people}`;
    const newAs = newUrl;

    window.history.pushState(
      { ...window.history.state, as: newAs, url: newUrl },
      '',
      newAs
    );
    closeHandler();
    router.reload();
  };

  return (
    <SimpleBarWrapper size={size}>
      <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
        <Header closeModalHandler={closeHandler} svg={svgPerson} />
        <h3 className="title">
          <FM id="mainform.person.t" />
        </h3>
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
            {childAge.length > 0 && (
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
                  {childAge.map(ageObject => (
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
            {(!isAgeSelectorShown && childAge.length < valRange.childMax) && (
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
          {resMessage && (
            <div style={{ marginBottom: '20px' }}>{resMessage}</div>
          )}
          {loading && <Loader />}
          <button
            className="apply_btn"
            onClick={selectedHandler}
            disabled={loading}
          >
            <FM id="common.apply" />
          </button>
        </div>
      </div>
    </SimpleBarWrapper>
  );
}
