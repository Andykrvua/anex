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
import SimpleBar from 'simplebar-react';

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
  
  const [selectedRange, setSelectedRange] = useState([fromNight, toNight]);
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
    setSelectedRange([from, to]);
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
              <button 
                onClick={() => selectNightRange(1, 3)}
                className={`${styles.night_button_new} ${selectedRange[0] === 1 && selectedRange[1] === 3 ? styles.night_button_new_selected : ''}`}>
                1-3 <FM id="common.night2" /><span className={styles.night_button_span}>, 2-4 <FM id="common.day2" /></span>
              </button>
              <button 
                onClick={() => selectNightRange(3, 5)} 
                className={`${styles.night_button_new} ${selectedRange[0] === 3 && selectedRange[1] === 5 ? styles.night_button_new_selected : ''}`}>
                3-5 <FM id="common.night5" /><span className={styles.night_button_span}>, 4-6 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(4, 6)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 4 && selectedRange[1] === 6 ? styles.night_button_new_selected : ''}`}>
                4-6 <FM id="common.night5" /><span className={styles.night_button_span}>, 5-7 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(5, 7)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 5 && selectedRange[1] === 7 ? styles.night_button_new_selected : ''}`}>
                5-7 <FM id="common.night5" /><span className={styles.night_button_span}>, 6-8 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(6, 8)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 6 && selectedRange[1] === 8 ? styles.night_button_new_selected : ''}`}>
                6-8 <FM id="common.night5" /><span className={styles.night_button_span}>, 7-9 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(7, 9)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 7 && selectedRange[1] === 9 ? styles.night_button_new_selected : ''}`}>
                7-9 <FM id="common.night5" /><span className={styles.night_button_span}>, 8-10 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(8, 10)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 8 && selectedRange[1] === 10 ? styles.night_button_new_selected : ''}`}>
                8-10 <FM id="common.night5" /><span className={styles.night_button_span}>, 9-11 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(9, 11)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 9 && selectedRange[1] === 11 ? styles.night_button_new_selected : ''}`}>
                9-11 <FM id="common.night5" /><span className={styles.night_button_span}>, 10-12 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(10, 12)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 10 && selectedRange[1] === 12 ? styles.night_button_new_selected : ''}`}>
                10-12 <FM id="common.night5" /><span className={styles.night_button_span}>, 11-13 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(11, 13)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 11 && selectedRange[1] === 13 ? styles.night_button_new_selected : ''}`}>
                11-13 <FM id="common.night5" /><span className={styles.night_button_span}>, 12-14 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(12, 14)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 12 && selectedRange[1] === 14 ? styles.night_button_new_selected : ''}`}>
                12-14 <FM id="common.night5" /><span className={styles.night_button_span}>, 13-15 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(13, 15)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 13 && selectedRange[1] === 15 ? styles.night_button_new_selected : ''}`}>
                13-15 <FM id="common.night5" /><span className={styles.night_button_span}>, 14-16 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(14, 16)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 14 && selectedRange[1] === 16 ? styles.night_button_new_selected : ''}`}>
                14-16 <FM id="common.night5" /><span className={styles.night_button_span}>, 15-17 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(15, 17)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 15 && selectedRange[1] === 17 ? styles.night_button_new_selected : ''}`}>
                15-17 <FM id="common.night5" /><span className={styles.night_button_span}>, 16-18 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(16, 18)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 16 && selectedRange[1] === 18 ? styles.night_button_new_selected : ''}`}>
                16-18 <FM id="common.night5" /><span className={styles.night_button_span}>, 17-19 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(17, 19)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 17 && selectedRange[1] === 19 ? styles.night_button_new_selected : ''}`}>
                17-19 <FM id="common.night5" /><span className={styles.night_button_span}>, 18-20 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(18, 20)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 18 && selectedRange[1] === 20 ? styles.night_button_new_selected : ''}`}>
                18-20 <FM id="common.night5" /><span className={styles.night_button_span}>, 19-21 <FM id="common.day1" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(19, 21)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 19 && selectedRange[1] === 21 ? styles.night_button_new_selected : ''}`}>
                19-21 <FM id="common.night1" /><span className={styles.night_button_span}>, 20-22 <FM id="common.day2" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(20, 22)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 20 && selectedRange[1] === 22 ? styles.night_button_new_selected : ''}`}>
                20-22 <FM id="common.night2" /><span className={styles.night_button_span}>, 21-23 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(21, 23)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 21 && selectedRange[1] === 23 ? styles.night_button_new_selected : ''}`}>
                21-23 <FM id="common.night2" /><span className={styles.night_button_span}>, 22-24 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(22, 24)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 22 && selectedRange[1] === 24 ? styles.night_button_new_selected : ''}`}>
                22-24 <FM id="common.night2" /><span className={styles.night_button_span}>, 23-25 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(23, 25)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 23 && selectedRange[1] === 25 ? styles.night_button_new_selected : ''}`}>
                23-25 <FM id="common.night5" /><span className={styles.night_button_span}>, 24-26 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(24, 26)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 24 && selectedRange[1] === 26 ? styles.night_button_new_selected : ''}`}>
                24-26 <FM id="common.night5" /><span className={styles.night_button_span}>, 25-27 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(25, 27)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 25 && selectedRange[1] === 27 ? styles.night_button_new_selected : ''}`}>
                25-27 <FM id="common.night5" /><span className={styles.night_button_span}>, 26-28 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(26, 28)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 26 && selectedRange[1] === 28 ? styles.night_button_new_selected : ''}`}>
                26-28 <FM id="common.night5" /><span className={styles.night_button_span}>, 27-29 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(27, 29)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 27 && selectedRange[1] === 29 ? styles.night_button_new_selected : ''}`}>
                27-29 <FM id="common.night5" /><span className={styles.night_button_span}>, 28-30 <FM id="common.day5" /></span>
              </button>
              <button 
              onClick={() => selectNightRange(28, 30)} 
              className={`${styles.night_button_new} ${selectedRange[0] === 28 && selectedRange[1] === 30 ? styles.night_button_new_selected : ''}`}>
                28-30 <FM id="common.night5" /><span className={styles.night_button_span}>, 29-31 <FM id="common.day5" /></span>
              </button>
            </div>

            {/* <span className={styles.nights_count}>
              <FM id="mainform.night.from" /> <b>{fromNight}</b>{' '}
              <span className="tolower">
                <FM id="mainform.night.to" />
              </span>{' '}
              <b>{toNight}</b> ночей
            </span>
            <span className={styles.days_count}>
              ({fromNight + 1} - {toNight + 1} <FM id="common.day5" />)
            </span> */}
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
