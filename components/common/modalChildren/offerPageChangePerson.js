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
import { FormattedMessage as FM, useIntl } from 'react-intl';
import Loader from 'components/common/loader';
import { useRouter } from 'next/router';

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

  const parseCurrentPeople = (people) => {
    const str = people;
    const str_length = people.length;

    const adult = Number(str[0]);
    const childTemp = str_length - 1;
    const child = childTemp === 0 ? 0 : childTemp / 2;
    let childAge = [];
    if (childTemp === 0) {
      childAge = [0, 0, 0, 0];
    } else {
      childAge = [
        str[2] ? Number(str[1] === '0' ? str[2] : str[1] + str[2]) : 0,
        str[4] ? Number(str[3] === '0' ? str[4] : str[3] + str[4]) : 0,
        str[6] ? Number(str[5] === '0' ? str[6] : str[5] + str[6]) : 0,
        str[8] ? Number(str[7] === '0' ? str[8] : str[7] + str[8]) : 0,
      ];
    }
    return { _adult: adult, _child: child, _childAge: childAge };
  };

  const { _adult, _child, _childAge } = parseCurrentPeople(
    getOfferParams.people
  );

  const [adult, setAdult] = useState(_adult);
  const [child, setChild] = useState(_child);
  const [childAge, setChildAge] = useState(_childAge);

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
    setResMessage('');
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
    setResMessage('');
    const newPerson = { adult, child, childAge };
    checkVariants(newPerson);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
  };

  const paramsToString = (newPerson) => {
    const childs = new Array(parseInt(newPerson.child))
      .fill(null)
      .map((_, ind) => {
        if (newPerson.childAge[ind].toString().length === 1) {
          return '0' + newPerson.childAge[ind].toString();
        } else {
          return newPerson.childAge[ind].toString();
        }
      });

    return newPerson.adult.toString() + childs.join('');
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
      people: paramsToString(newPerson),
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
    const locale = router.locale === 'ru' ? '' : `${router.locale}/`;
    const newPerson = { adult, child, childAge };
    const people = paramsToString(newPerson);

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
