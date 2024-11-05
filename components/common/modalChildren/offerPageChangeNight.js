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

  // Функция выбора диапазона ночей и дней
  const selectNightRange = (from, to) => {
    setFromNight(from);
    setToNight(to);
    
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

    const search = await fetch('/api/endpoints/isOfferSearchVariants/', {
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
    const locale = router.locale === 'ru' ? '' : `/${router.locale}`;
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
      <div className={styles.nights_custom_wrapper}>
        <div
          className={`${styles.popup_scrollable_content} popup_scrollable_content`}
          ref={scrollable}
        >
          <div className={styles.night_button_wrapper}>
            <button onClick={() => selectNightRange(1, 3)} className={styles.night_button_new}>
              1-3 ночи<span className={styles.night_button_span}>, 2-4 дня</span>
            </button>
            <button onClick={() => selectNightRange(2, 4)} className={styles.night_button_new}>
              2-4 ночи<span className={styles.night_button_span}>, 3-5 дня</span>
            </button>
            <button onClick={() => selectNightRange(3, 5)} className={styles.night_button_new}>
              3-5 ночей<span className={styles.night_button_span}>, 4-6 дней</span>
            </button>
            <button onClick={() => selectNightRange(4, 6)} className={styles.night_button_new}>
              4-6 ночей<span className={styles.night_button_span}>, 5-7 дней</span>
            </button>
            <button onClick={() => selectNightRange(5, 7)} className={styles.night_button_new}>
              5-7 ночей<span className={styles.night_button_span}>, 6-8 дней</span>
            </button>
            <button onClick={() => selectNightRange(6, 8)} className={styles.night_button_new}>
              6-8 ночей<span className={styles.night_button_span}>, 7-9 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              7-9 ночей<span className={styles.night_button_span}>, 8-10 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              8-10 ночей<span className={styles.night_button_span}>, 9-11 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              9-11 ночей<span className={styles.night_button_span}>, 10-12 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              10-12 ночей<span className={styles.night_button_span}>, 11-13 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              11-13 ночей<span className={styles.night_button_span}>, 12-14 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              12-14 ночей<span className={styles.night_button_span}>, 13-15 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              13-15 ночей<span className={styles.night_button_span}>, 14-16 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              14-16 ночей<span className={styles.night_button_span}>, 15-17 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              15-17 ночей<span className={styles.night_button_span}>, 16-18 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              16-18 ночей<span className={styles.night_button_span}>, 17-19 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              17-19 ночей<span className={styles.night_button_span}>, 18-20 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              18-20 ночей<span className={styles.night_button_span}>, 19-21 день</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              19-21 ночей<span className={styles.night_button_span}>, 20-22 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              20-22 ночей<span className={styles.night_button_span}>, 21-23 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              21-23 ночей<span className={styles.night_button_span}>, 22-24 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              22-24 ночей<span className={styles.night_button_span}>, 23-25 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              23-25 ночей<span className={styles.night_button_span}>, 24-26 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              24-26 ночей<span className={styles.night_button_span}>, 25-27 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              25-27 ночей<span className={styles.night_button_span}>, 26-28 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              26-28 ночей<span className={styles.night_button_span}>, 27-29 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              27-29 ночей<span className={styles.night_button_span}>, 28-30 дней</span>
            </button>
            <button onClick={() => selectNightRange(7, 9)} className={styles.night_button_new}>
              28-30 ночей<span className={styles.night_button_span}>, 29-31 день</span>
            </button>
          </div>

          <span className={styles.nights_count}>
            <FM id="mainform.night.from" /> <b>{fromNight}</b>{' '}
            <span className="tolower">
              <FM id="mainform.night.to" />
            </span>{' '}
            <b>{toNight}</b> ночей
          </span>
          <span className={styles.days_count}>
            ({fromNight + 1} - {toNight + 1} <FM id="common.day5" />)
          </span>
        </div>
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
