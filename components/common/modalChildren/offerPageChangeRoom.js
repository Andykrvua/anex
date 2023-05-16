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
import styles from './offerPageChangeRoom.module.css';
import { useGetOfferParams } from 'store/store';
import Loader from 'components/common/loader';
import { mainFormNightValidationRange as valRange } from 'utils/constants';
import { FormattedMessage as FM } from 'react-intl';
import { useRouter } from 'next/router';
import { foodAll } from 'utils/constants';

export default function Room({ closeHandler }) {
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
      /* eslint-disable-next-line */
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
        {/* <FM id="mainform.night.t" /> */}
        Номер, питание
      </h3>
      <div
        className={`${styles.popup_scrollable_content} popup_scrollable_content`}
        ref={scrollable}
      >
        <div className={styles.header}>
          {foodAll.map((item) => (
            <div key={item.name} className={styles.header_item}>
              <span className={styles.header_item_title}>{item.name}</span>
              <span className={styles.header_item_descr}>
                <FM id={item.translate} />
              </span>
            </div>
          ))}
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