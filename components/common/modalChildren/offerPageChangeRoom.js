import { useRef, useEffect, useState } from 'react';
import useOutsideClick from 'utils/clickOutside';
import {
  useSetBodyScroll,
  getSize,
  clear,
  disableScroll,
  maxWidth,
} from 'utils/useBodyScroll';
import Header from 'components/mainform/popups/header';
import { svgNight } from 'components/mainform/form-fields/svg';
import styles from './offerPageChangeRoom.module.css';
import { useGetOfferParams, useGetCurrentOffer } from 'store/store';
import Loader from 'components/common/loader';
import { FormattedMessage as FM } from 'react-intl';
import { useRouter } from 'next/router';
import { foodAll } from 'utils/constants';

export default function Room({ closeHandler }) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const getOfferParams = useGetOfferParams();
  const getCurrentOffer = useGetCurrentOffer();

  const router = useRouter();

  useOutsideClick(wrapperRef);
  useSetBodyScroll(maxWidth, size.width);

  const [loading, setLoading] = useState(false);
  const [resMessage, setResMessage] = useState('');
  const [offers, setOffers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const getUniqueRooms = (arr) => {
    // eslint-disable-next-line
    const unique = new Set();
    arr.forEach((obj) => {
      unique.add(obj.r);
    });
    return Array.from(unique);
  };

  const checkVariants = async () => {
    setLoading(true);

    const postData = {
      from: getOfferParams.from,
      to: getOfferParams.hotelId,
      transport: getOfferParams.transport,
      checkIn: getCurrentOffer.d,
      checkTo: getOfferParams.checkTo,
      nights: getCurrentOffer.n,
      nightsTo: getCurrentOffer.n,
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
          'В этом отеле нет других типов номеров и питания. Попробуйте выбрать другую дату или изменить длительность'
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

    const { d, n, nh } = getCurrentOffer;

    // parse api res from create array and find the same night, hotel night, day start
    Object.entries(apiData).forEach(([_operatorId, value]) => {
      Object.entries(value).forEach(([_hotelId, data]) => {
        Object.entries(data.offers).forEach(([_offerId, offerValue]) => {
          if (
            offerValue.d === d &&
            offerValue.n === n &&
            offerValue.nh === nh
          ) {
            resultData.push(offerValue);
          }
        });
      });
    });

    // sort min price, minimum 1 offer = current offer
    const sortedData = resultData.sort((a, b) => a.pl - b.pl);
    if (sortedData.length !== 1) {
      setRooms(getUniqueRooms(sortedData));
      setOffers(sortedData);
    } else {
      setResMessage(
        'В этом отеле нет других типов номеров и питания. Попробуйте выбрать другую дату или изменить длительность'
      );
    }
  };

  const Offer = ({ food, room }) => {
    let result;

    if (food === 'AI') {
      result = offers.filter(
        (item) =>
          (item.f.toUpperCase() === food || item.f.toUpperCase() === 'UAI') &&
          item.r === room
      );
    } else {
      result = offers.filter(
        (item) => item.f.toUpperCase() === food && item.r === room
      );
    }

    if (result.length > 1) {
      result.sort((a, b) => a.pl - b.pl);

      const isCurrent = result.filter((item) => item.i === getCurrentOffer.i);

      isCurrent.length ? (result = isCurrent) : null;
    } else if (result.length === 0) {
      return null;
    }

    return (
      <div
        className={`${styles.room_row_item} ${
          result[0].i === getCurrentOffer.i ? styles.room_row_item_current : ''
        }`}
      >
        <a
          className={styles.offer_link}
          href={
            result[0].i !== getCurrentOffer.i
              ? `${router.locale === 'uk' ? '/uk' : ''}/hotels/${
                  getOfferParams.country
                }/${getOfferParams.hotel}/?offer=${result[0].i}&transport=${
                  result[0].t
                }&from=${result[0].c}&fromname=${getOfferParams.fromname}&to=${
                  getOfferParams.to
                }&checkIn=${result[0].d}&checkTo=${
                  getOfferParams.checkTo
                }&nights=${result[0].n}&nightsTo=${
                  getOfferParams.nightsTo
                }&people=${result[0].a}`
              : null
          }
          target="_blank"
          rel="noopener noreferrer"
        >
          <span
            className={`${styles.room_row_item_title} ${
              result[0].i === getCurrentOffer.i
                ? styles.room_row_item_title_current
                : ''
            }`}
          >
            {new Intl.NumberFormat('uk-UA', {
              maximumFractionDigits: 0,
              minimumFractionDigits: 0,
            }).format(result[0].pl)}
          </span>
          <span
            className={`${styles.room_row_item_descr} ${
              result[0].i === getCurrentOffer.i
                ? styles.room_row_item_descr_current
                : ''
            }`}
          >
            грн
          </span>
        </a>
      </div>
    );
  };

  useEffect(() => {
    if (size.width < maxWidth) {
      disableScroll(scrollable.current);
    }
    return () => {
      clear();
    };
  }, [size.width]);

  useEffect(() => {
    checkVariants();
  }, []);

  return (
    <div
      className="main_form_popup_mobile_wrapper"
      ref={wrapperRef}
      style={{ maxHeight: 'inherit', overflow: 'auto' }}
    >
      <Header closeModalHandler={closeHandler} svg={svgNight} />
      <h3 className="title">
        <FM id="offer_page.room_food" />
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
        <div className={styles.room}>
          {rooms.map((room) => (
            <div key={room} className={styles.room_item}>
              <div className={styles.room_item_name}>{room}</div>
              <div className={styles.room_row}>
                {foodAll.map((food) => (
                  <div key={food.name} className={styles.room_row_item_wrapper}>
                    <Offer food={food.name} room={room} />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="apply_btn_wrapper">
        {resMessage && <div style={{ marginBottom: '20px' }}>{resMessage}</div>}
        {loading && <Loader />}
        {/* <button
          className="apply_btn"
          onClick={selectedHandler}
          disabled={loading}
        >
          <FM id="common.apply" />
        </button> */}
      </div>
    </div>
  );
}
