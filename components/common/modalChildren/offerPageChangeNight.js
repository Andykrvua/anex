import { useRef, useEffect, useState } from 'react';
import useOutsideClick from 'utils/clickOutside';
import {
  useSetBodyScroll,
  getSize,
  enableScroll,
  clear,
  disableScroll,
  maxWidth,
  BODY,
} from 'utils/useBodyScroll';
import Header from 'components/mainform/popups/header';
import { svgNight } from 'components/mainform/form-fields/svg';
import styles from 'components/mainform/popups/night.module.css';
import { useGetOfferParams } from 'store/store';
import Loader from 'components/common/loader';
import { mainFormNightValidationRange as valRange } from 'utils/constants';
import SvgPlus from 'components/svgPlus';
import SvgMinus from 'components/svgMinus';
import { FormattedMessage as FM } from 'react-intl';
import { useRouter } from 'next/router';

export default function Night({ closeHandler }) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const getOfferParams = useGetOfferParams();

  const router = useRouter();

  useOutsideClick(wrapperRef);
  useSetBodyScroll(maxWidth, size.width);

  const [loading, setLoading] = useState(false);
  const [resMessage, setResMessage] = useState('');

  const [fromNight, setFromNight] = useState(Number(getOfferParams.nights));
  const [toNight, setToNight] = useState(Number(getOfferParams.nightsTo));

  useEffect(() => {
    if (size.width < maxWidth) {
      disableScroll(scrollable.current);
    }
    return () => {
      clear();
    };
  }, [size.width]);

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
    setResMessage('');
    checkVariants(newNight);

    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
  };

  const checkVariants = async (newNight) => {
    setLoading(true);

    const postData = {
      from: getOfferParams.from,
      to: getOfferParams.hotelId,
      transport: getOfferParams.transport,
      checkIn: getOfferParams.checkIn,
      checkTo: getOfferParams.checkTo,
      nights: newNight.from,
      nightsTo: newNight.to,
      people: getOfferParams.people,
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
          'В этом отеле нет предложений с такой длительностью. Попробуйте выбрать другую дату'
        );
      }
    } else {
      setLoading(false);
      console.log('api bad res');
    }
  };

  const ResultHandler = (apiData) => {
    const resultData = [];

    const { dateStart, food, offer } = getOfferParams;

    // parse api res from create array and find the same food, daystart, night count
    Object.entries(apiData).forEach(([operatorId, value]) => {
      Object.entries(value).forEach(([hotelId, data]) => {
        Object.entries(data.offers).forEach(([offerId, offerValue]) => {
          if (
            offerValue.fn === food &&
            offerValue.d === dateStart &&
            offerValue.i !== offer
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
        'В этом отеле нет предложений с вашими параметрами для такой длительности. Попробуйте выбрать другую дату или изменить параметры питания'
      );
    }
  };

  const changeOffer = (offer) => {
    const locale = router.locale === 'ru' ? '' : `${router.locale}/`;
    const nights = { from: fromNight, to: toNight };

    const newUrl = `${locale}/hotels/${getOfferParams.country}/${getOfferParams.hotel}/?offer=${offer.i}&transport=${offer.t}&from=${getOfferParams.from}&fromname=${getOfferParams.fromname}&to=${getOfferParams.to}&checkIn=${getOfferParams.checkIn}&checkTo=${getOfferParams.checkTo}&nights=${nights.from}&nightsTo=${nights.to}&people=${getOfferParams.people}`;
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
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeHandler} svg={svgNight} />
      <h3 className="title">
        <FM id="mainform.night.t" />
      </h3>
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
        {resMessage && <div style={{ marginBottom: '20px' }}>{resMessage}</div>}
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
  );
}
