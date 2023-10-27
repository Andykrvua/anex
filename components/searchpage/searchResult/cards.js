import styles from './cards.module.css';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { shimmer, toBase64 } from '/utils/blurImage';
import { useSetModal, useGetPerson, useSetOpenStreetMap, useSetWindowInfo } from 'store/store';
import ratingColor from 'utils/ratingColor';
import declension from 'utils/declension';
import { food, modal, infoModal } from 'utils/constants';

const CardsOffersVariants = ({ hotel, searchParams }) => {
  const router = useRouter();
  const setModal = useSetModal();
  const person = useGetPerson();
  const setOpenStreetMapData = useSetOpenStreetMap();

  console.log(hotel);

  const intl = useIntl();
  const tTxt1 = intl.formatMessage({
    id: 'common.night1',
  });
  const tTxt2 = intl.formatMessage({
    id: 'common.night2',
  });
  const tTxt5 = intl.formatMessage({
    id: 'common.night5',
  });

  const decl = (val) => declension(val, tTxt1, tTxt2, tTxt5);

  const data = hotel.actualOffers.reduce((acc, val, ind, arr) => {
    if (ind === 0) {
      acc.push(val);
    } else {
      if (val.pl !== arr[ind - 1].pl) {
        acc.push(val);
      }
    }
    return acc;
  }, []);

  // eslint-disable-next-line
  const foodHelper = new Set(data.map((i) => i.f));
  const foodTxt = Array.from(foodHelper);

  let foodTransMessage = '';
  if (foodTxt.length === 1) {
    foodTransMessage = intl.formatMessage({
      id: food[foodTxt[0]],
    });
    foodTransMessage += ', ';
  }

  const transports = {
    bus: 'hotel_card.transport.bus',
    air: 'hotel_card.transport.air',
    train: 'hotel_card.transport.train',
    ship: 'hotel_card.transport.ship',
  };

  foodTransMessage += `за ${person.adult + person.child} ${
    transports[router.query.transport]
      ? intl.formatMessage({
          id: transports[router.query.transport],
        })
      : ''
  }`;

  const OpenStreetMapBtn = () => {
    if (!hotel.g) {
      return null;
    }

    const modalHandler = () => {
      setOpenStreetMapData({
        img: `https://newimg.otpusk.com/2/400x300/${hotel.f}`,
        hotelName: hotel.n,
        rating: hotel.r,
        foodTransMessage,
        price: new Intl.NumberFormat('uk-UA', {
          style: 'currency',
          currency: 'UAH',
          maximumFractionDigits: 0,
          minimumFractionDigits: 0,
        }).format(data[0].pl),
        coords: hotel.g,
        stars: hotel.s,
      });
      setModal({ get: modal.hotelCardsMap });
    };

    return (
      <button onClick={() => modalHandler()} className={styles.maps}>
        <img src="/assets/img/svg/tour/map-marker.svg" alt="map" />
        <span>
          <FM id="hotel_card.map" />
        </span>
      </button>
    );
  };

  const saveToLocalStorage = () => {
    const res = JSON.parse(localStorage.getItem('result') || '[]');

    const item = {
      img: `https://newimg.otpusk.com/2/500x375/${hotel.f}`,
      hotelName: hotel.n,
      stars: parseInt(hotel.s),
      country: hotel.t.n,
      district: hotel.c.n,
      rating: hotel.r,
      reviews: hotel.v,
      description: foodTransMessage,
      orders: [],
      id: hotel.i,
    };

    const offArr = data.map((item, ind) => {
      if (ind < 6) {
        return {
          link: `${router.locale === 'uk' ? '/uk' : ''}/hotels/${hotel.t.c}/${hotel.t.i}-${hotel.i}-${
            hotel.h
          }?offer=${item.i}&transport=${searchParams.transport}&from=${searchParams.from}&fromname=${
            searchParams.fromname
          }&to=${searchParams.to}&checkIn=${searchParams.checkIn}&checkTo=${searchParams.checkTo}&nights=${
            searchParams.nights
          }&nightsTo=${searchParams.nightsTo}&people=${searchParams.people}`,
          start: new Date(item.d).toLocaleDateString('default', {
            day: '2-digit',
            month: '2-digit',
          }),
          end: new Date(item.dt).toLocaleDateString('default', {
            day: '2-digit',
            month: '2-digit',
          }),
          n: `${item.nh} ${decl(item.nh)}`,
          r: item.r,
          price: new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(item.pl),
          id: item.i,
        };
      }
    });

    item.orders = offArr.slice(0, 6);

    res.push(item);
    localStorage.setItem('result', JSON.stringify(res));
  };
  saveToLocalStorage();

  const saveRatingCookie = () => {
    if (!hotel?.rb) return;

    const data = JSON.stringify(hotel.rb);
    let expires = '';

    const date = new Date();
    date.setTime(date.getTime() + 3 * 24 * 60 * 60 * 1000);
    expires = '; expires=' + date.toUTCString();

    document.cookie = hotel.i + '=' + (data || '') + expires + '; path=/';
  };
  return (
    <>
      <div className={styles.maps_and_options}>
        <OpenStreetMapBtn />
        <p className={styles.options}>{foodTransMessage}</p>
      </div>

      {data.map((item, ind) => {
        if (ind < 4) {
          return (
            <a
              className={styles.card_order}
              onClick={saveRatingCookie}
              href={`${router.locale === 'uk' ? '/uk' : ''}/hotels/${hotel.t.c}/${hotel.t.i}-${hotel.i}-${
                hotel.h
              }?offer=${item.i}&transport=${searchParams.transport}&from=${searchParams.from}&fromname=${
                searchParams.fromname
              }&to=${searchParams.to}&checkIn=${searchParams.checkIn}&checkTo=${
                searchParams.checkTo
              }&nights=${searchParams.nights}&nightsTo=${searchParams.nightsTo}&people=${
                searchParams.people
              }`}
              target="_blank"
              rel="noopener noreferrer"
              key={item.i}
            >
              <span className={styles.order_text_wrapper}>
                <span className={styles.order_text__duration}>
                  <span>
                    {new Date(item.d).toLocaleDateString('default', {
                      day: '2-digit',
                      month: '2-digit',
                    })}{' '}
                    <FM id="hotel_card.tourstart" />
                  </span>
                </span>
                <span className={styles.order_text__people}>
                  <span>
                    {new Date(item.dt).toLocaleDateString('default', {
                      day: '2-digit',
                      month: '2-digit',
                    })}{' '}
                    <FM id="hotel_card.tourend" />
                  </span>
                </span>
              </span>
              <span className={`${styles.order_text_wrapper}, ${styles.order_text_wrapper__fluid}`}>
                <span className={styles.order_text__duration}>
                  <span>
                    {item.nh} {decl(item.nh)}
                    {item.n - item.nh !== 0
                      ? ` + ${item.n - item.nh} ${intl.formatMessage({
                          id: 'hotel_card.tour_time',
                        })}`
                      : ''}
                  </span>
                </span>
                <span className={styles.order_text__people}>
                  <span>{item.r}</span>
                </span>
              </span>
              <span className={styles.order_price}>
                {new Intl.NumberFormat('uk-UA', {
                  style: 'currency',
                  currency: 'UAH',
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(item.pl)}
                <img src="/assets/img/svg/arrow.svg" alt="" />
              </span>
            </a>
          );
        }
      })}
    </>
  );
};

export default function Cards({ hotels = [], step, countryHotelService = [], searchParams }) {
  const setModalInfo = useSetWindowInfo();
  const intl = useIntl();
  localStorage.removeItem('result');

  const addToFavorites = (id) => {
    const save_result = JSON.parse(localStorage.getItem('result') || '[]');
    if (save_result.length) {
      const add = save_result.filter((tour) => tour.id === id);
      let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (favorites.find((item) => item.id === id)) {
        const temp = favorites.filter((item) => item.id !== id);
        favorites = temp;
      }
      favorites.push(add[0]);
      localStorage.setItem('favorites', JSON.stringify(favorites));
    }

    const data = {
      show: true,
      type: infoModal.ok,
      text: intl.formatMessage({ id: 'favorites.add' }),
    };
    setModalInfo(data);
  };

  return (
    <div className={styles.cards_wrapper}>
      {hotels.map((item, j) => {
        if (j < step) {
          return (
            <div className={styles.card} key={item.i}>
              <div className={styles.card_img}>
                <Image
                  className={styles.img}
                  src={`https://newimg.otpusk.com/2/500x375/${item.f}`}
                  alt=""
                  layout="fill"
                  // width={500}
                  // height={375}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(500, 375))}`}
                />
                {item.rb ? (
                  <div className={styles.review}>
                    {Object.entries(item.rb).map((el) => {
                      if (el[1].site === 'tripadvisor' || el[1].site === 'booking') {
                        return (
                          <div className={styles.review_item} key={el[1].site}>
                            <img
                              src={`/assets/img/svg/${el[1].site}.svg`}
                              alt={el[1].site}
                              title={el[1].site}
                              width="24"
                              height="24"
                            />

                            <p
                              className={styles.review__number}
                              style={{ color: ratingColor(parseFloat(el[1].rating)) }}
                            >
                              {el[1].rating}/10
                            </p>
                          </div>
                        );
                      }
                    })}
                  </div>
                ) : null}
                <button className={styles.favorites_btn} onClick={() => addToFavorites(item.i)}>
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 26 26"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M4.98456 14.4375L13.1659 22.7838L21.3394 14.4375L21.3413 14.4355C22.2281 13.5189 22.7239 12.2935 22.7239 11.018C22.7239 9.74207 22.2277 8.51616 21.3402 7.59944C20.9096 7.15681 20.3946 6.80494 19.8256 6.56462C19.2565 6.3242 18.6448 6.20029 18.027 6.2002C17.4091 6.20029 16.7976 6.3242 16.2285 6.56462C15.6595 6.80496 15.144 7.15741 14.7133 7.60009L13.8839 8.45483L13.1698 9.19067L12.4521 8.45845L11.6134 7.60289L11.6108 7.6002C11.1799 7.15735 10.6647 6.80534 10.0955 6.56498C9.52633 6.32463 8.91475 6.20079 8.29689 6.20079C7.67904 6.20079 7.06745 6.32463 6.49827 6.56498C5.92942 6.8052 5.41446 7.15692 4.98378 7.59939C4.0963 8.51612 3.6001 9.74205 3.6001 11.018C3.6001 12.2934 4.09584 13.5188 4.98254 14.4354L4.98456 14.4375Z"
                      stroke="url(#paint0_linear_7014_4819)"
                      strokeWidth="2"
                    />
                    <defs>
                      <linearGradient
                        id="paint0_linear_7014_4819"
                        x1="2.86414"
                        y1="-12.3034"
                        x2="32.8441"
                        y2="-6.48617"
                        gradientUnits="userSpaceOnUse"
                      >
                        <stop offset="0.240837" stopColor="#FF9400" />
                        <stop offset="1" stopColor="#FF1821" />
                      </linearGradient>
                    </defs>
                  </svg>
                </button>
              </div>
              <div className={styles.card_text}>
                <p className={styles.country_text}>{`${item.t.n}, ${item.c.n}`}</p>
                <div className={styles.stars_wrapper}>
                  {new Array(parseInt(item.s)).fill(null).map((_, ind) => {
                    return (
                      <div className={styles.stars} key={ind}>
                        <img src="/assets/img/svg/tour/star.svg" alt="star" width="12" height="12" />
                      </div>
                    );
                  })}
                </div>
                <h4 className={styles.hotel_name}>{item.n}</h4>
                <div className={styles.tour_propertys}>
                  {item.e.map((property, ind) => {
                    return countryHotelService
                      .map((item) => Object.keys(item))
                      .map((item) => {
                        if (item.includes(property)) {
                          return countryHotelService
                            .map((item) => Object.entries(item))
                            .map((item) =>
                              item.map((searched) => {
                                return searched.includes(property) ? (
                                  <div className={styles.tour_property} key={ind}>
                                    <img
                                      className={styles.tour_property__icon}
                                      src={`/assets/img/svg/tour_property/${searched[0]}.svg`}
                                      alt=""
                                    />
                                    <p className={styles.tour_property__title}>{searched[1]}</p>
                                  </div>
                                ) : null;
                              })
                            );
                        }
                      });
                  })}
                </div>
                <CardsOffersVariants hotel={item} searchParams={searchParams} />
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
