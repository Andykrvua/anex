import styles from './cards.module.css';
import { useSetModal, useGetPerson, useGetSearchUrl } from 'store/store';
import ratingColor from 'utils/ratingColor';
import declension from 'utils/declension';
import { food } from 'utils/constants';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { modal } from 'utils/constants';
import { useSetOpenStreetMap } from 'store/store';

// get 3 min price offers variants
const CardsOffersVariants = ({ offers, hotelId, hotel }) => {
  const setModal = useSetModal();
  const person = useGetPerson();
  const searchUrl = useGetSearchUrl();
  const setOpenStreetMapData = useSetOpenStreetMap();

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

  const actualOffers = [];

  Object.entries(offers).map(([offerOperatorId, value]) => {
    return Object.entries(value).map(([offerHotelId, data]) => {
      if (offerHotelId === hotelId) {
        Object.entries(data.offers).map(([offerId, value]) => {
          actualOffers.push(value);
        });
      }
    });
  });

  function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url.split('?')[1];

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {
      // stuff after # is not part of query string, so get rid of it
      queryString = queryString.split('#')[0];

      // split our query string into its component parts
      var arr = queryString.split('&');

      for (var i = 0; i < arr.length; i++) {
        // separate the keys and the values
        var a = arr[i].split('=');

        // set parameter name and value (use 'true' if empty)
        var paramName = a[0];
        var paramValue = typeof a[1] === 'undefined' ? true : a[1];

        // (optional) keep case consistent
        paramName = paramName.toLowerCase();
        if (typeof paramValue === 'string')
          paramValue = paramValue.toLowerCase();

        // if the paramName ends with square brackets, e.g. colors[] or colors[2]
        if (paramName.match(/\[(\d+)?\]$/)) {
          // create key if it doesn't exist
          var key = paramName.replace(/\[(\d+)?\]/, '');
          if (!obj[key]) obj[key] = [];

          // if it's an indexed array e.g. colors[2]
          if (paramName.match(/\[\d+\]$/)) {
            // get the index value and add the entry at the appropriate position
            var index = /\[(\d+)\]/.exec(paramName)[1];
            obj[key][index] = paramValue;
          } else {
            // otherwise add the value to the end of the array
            obj[key].push(paramValue);
          }
        } else {
          // we're dealing with a string
          if (!obj[paramName]) {
            // if it doesn't exist, create property
            obj[paramName] = paramValue;
          } else if (obj[paramName] && typeof obj[paramName] === 'string') {
            // if property does exist and it's a string, convert it to an array
            obj[paramName] = [obj[paramName]];
            obj[paramName].push(paramValue);
          } else {
            // otherwise add the property
            obj[paramName].push(paramValue);
          }
        }
      }
    }

    return obj;
  }

  console.log('getAllUrlParams', getAllUrlParams(searchUrl));

  actualOffers.sort(function (a, b) {
    return a.pl - b.pl;
  });

  const data = actualOffers.reduce((acc, val, ind, arr) => {
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
  foodTransMessage += `за ${person.adult + person.child} с перелетом`;

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
        <span>Отель на карте</span>
      </button>
    );
  };

  return (
    <>
      <div className={styles.maps_and_options}>
        <OpenStreetMapBtn />
        <p className={styles.options}>{foodTransMessage}</p>
      </div>

      {data.map((item, ind) => {
        if (ind < 3) {
          return (
            <a className={styles.card_order} href="" key={item.i}>
              <span className={styles.order_text_wrapper}>
                <span className={styles.order_text__duration}>
                  <span>
                    {new Date(item.d).toLocaleDateString('default', {
                      day: '2-digit',
                      month: '2-digit',
                    })}{' '}
                    заезд
                  </span>
                </span>
                <span className={styles.order_text__people}>
                  <span>
                    {new Date(item.dt).toLocaleDateString('default', {
                      day: '2-digit',
                      month: '2-digit',
                    })}{' '}
                    выезд
                  </span>
                </span>
              </span>
              <span
                className={`${styles.order_text_wrapper}, ${styles.order_text_wrapper__fluid}`}
              >
                <span className={styles.order_text__duration}>
                  <span>
                    {item.n} {decl(item.n)}
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

export default function Cards({
  hotels = [],
  offers = null,
  step,
  countryHotelService = [],
}) {
  return (
    <div className={styles.cards_wrapper}>
      {Object.entries(hotels).map(([hotelId, item], j) => {
        if (j < step) {
          return (
            <div className={styles.card} key={item.i}>
              <div className={styles.card_img}>
                <img
                  src={`https://newimg.otpusk.com/2/500x375/${item.f}`}
                  className={styles.img}
                  alt=""
                  width={500}
                  height={375}
                />
                {item.r ? (
                  <div className={styles.review}>
                    {!item.v && <p>Рейтинг</p>}
                    <p
                      className={styles.review__number}
                      style={{ color: ratingColor(parseFloat(item.r)) }}
                    >
                      {item.r}/10
                    </p>
                    {item.v && <p>Отзывов:</p>}
                    {item.v && (
                      <p className={styles.review__medium}>{item.v}</p>
                    )}
                  </div>
                ) : null}
                {/* <Image
                className={styles.img}
                src={item.img}
                alt=""
                layout="responsive"
                width={333}
                height={240}
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(333, 240)
                )}`}
                quality="100"
              /> */}
              </div>
              <div className={styles.card_text}>
                <p className={styles.country_text}>
                  {/* {`${item.country}, ${item.district}`} */}
                  {`${item.t.n}, ${item.c.n}`}
                </p>
                <div className={styles.stars_wrapper}>
                  {new Array(parseInt(item.s)).fill(null).map((_, ind) => {
                    return (
                      <div className={styles.stars} key={ind}>
                        <img
                          src="/assets/img/svg/tour/star.svg"
                          alt="star"
                          width="12"
                          height="12"
                        />
                      </div>
                    );
                  })}
                </div>
                <h4 className={styles.hotel_name}>
                  {item.n}
                  {item.i}
                </h4>
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
                                  <div
                                    className={styles.tour_property}
                                    key={ind}
                                  >
                                    <img
                                      className={styles.tour_property__icon}
                                      src={`/assets/img/svg/tour_property/${searched[0]}.svg`}
                                      alt=""
                                    />
                                    <p className={styles.tour_property__title}>
                                      {searched[1]}
                                    </p>
                                  </div>
                                ) : null;
                              })
                            );
                        }
                      });
                  })}
                </div>
                <CardsOffersVariants
                  offers={offers}
                  hotelId={hotelId}
                  hotel={item}
                />
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

{
  /* <div key={ind} style={{ border: '1px solid blue' }}>
          <div>OfferId: {item.i}</div>
          <div>4 Количество взрослых: {item.ah}</div>
          <div>Город отправления: {item.c}</div>
          <div>1 Дата: {item.d}</div>
          <div>2 Дата возврата: {item.dt}</div>
          <div>Питание: {item.f}</div>
          <div>3 Длительность тура в ночах: {item.n}</div>
          <div>Длительность проживания в отеле в ночах: {item.nh}</div>
          <div>Что включено: {item.o}</div>
          <div>operatorId: {item.oi}</div>
          <div>5 Стоимость: {item.pl}</div>
          <div>Тип номера: {item.r}</div>
          <div>Room Id: {item.ri}</div>
          <div>Дата получения цены от оператора: {item.last}</div>
          <div>Stop Sale: {JSON.stringify(item.ss)}</div>
          <div>Тип транспорта: {item.t}</div>
          <div>
            Варианты перелетов туда: {JSON.stringify(item.to.from, null, '\t')}
          </div>
          <div>
            Варианты перелетов обратно: {JSON.stringify(item.to.to, null, '\t')}
          </div>
          <div>Размещение: {item.y}</div>
        </div> */
}
