import styles from './cards.module.css';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import { useSetModal, useGetPerson } from 'store/store';
import ratingColor from 'utils/ratingColor';
import declension from 'utils/declension';
import { FormattedMessage as FM, useIntl } from 'react-intl';

// get 3 min price offers variants
const CardsOffersVariants = ({ offers, hotelId }) => {
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
  console.log('actualOffers hotel Id', hotelId, actualOffers);

  actualOffers.sort(function (a, b) {
    return a.pl - b.pl;
  });
  console.log('aa', actualOffers);
  return actualOffers.map((item, ind) => {
    if (ind < 3) {
      return (
        <a className={styles.card_order} href="">
          <span className={styles.order_text_wrapper}>
            <span className={styles.order_text__duration}>
              <span>
                {item.n} {decl(item.n)}
              </span>
            </span>
            <span className={styles.order_text__people}>
              <span>
                <FM id="result.common.food" /> {item.f}
              </span>
            </span>
          </span>
          <span className={styles.order_price}>
            {new Intl.NumberFormat('uk-UA', {
              style: 'currency',
              currency: 'UAH',
            }).format(item.pl)}
            {/* <span>&nbsp;грн</span> */}
            <img src="/assets/img/svg/arrow.svg" alt="" />
          </span>
        </a>

        // <div>1 Дата: {item.d}</div>
        // <div>2 Дата возврата: {item.dt}</div>
        // <div>3 Длительность тура в ночах: {item.n}</div>
        // <div>4 Количество взрослых: {item.ah}</div>
        // <div>5 Стоимость: {item.pl}</div>
      );
    }
  });
  // return <div>sasas</div>;
};

export default function Cards({
  hotels = [],
  offers = null,
  step,
  countryHotelService = [],
}) {
  console.log(hotels);
  console.log(offers);
  const setModal = useSetModal();
  const person = useGetPerson();
  console.log('sss', person);
  console.log('rr');
  console.log('step', step);

  //   Object.keys(tifs).map(key =>
  //     <option value={key}>{tifs[key]}</option>
  // )

  return (
    <div className={styles.cards_wrapper}>
      {Object.entries(hotels).map(([hotelId, item], j) => {
        if (j < step) {
          return (
            <div className={styles.card} key={item.id}>
              <div className={styles.card_img}>
                <img
                  src={`https://newimg.otpusk.com/2/400x300/${item.f}`}
                  className={styles.img}
                  alt=""
                  width={730}
                  // height={240}
                />
                {item.r ? (
                  <div className={styles.review}>
                    {!item.v && <p>Рейтинг</p>}
                    <p
                      className={styles.review__number}
                      style={{ color: ratingColor(parseFloat(item.rating)) }}
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
                <div className={styles.maps_and_options}>
                  <button
                    onClick={() => setModal(true)}
                    className={styles.maps}
                  >
                    <img src="/assets/img/svg/tour/map-marker.svg" alt="map" />
                    <span>Отель на карте</span>
                  </button>
                  <p className={styles.options}>
                    За {person.adult + person.child} с транспортом
                  </p>
                </div>
                {/* offers */}
                {console.log('offers', offers)}
                <CardsOffersVariants offers={offers} hotelId={hotelId} />
                {/* {Object.entries(offers).map(([operatorId, value]) => {
                  return Object.entries(value).map(([offerKey, data]) => {
                    if (offerKey === hotelId) {
                      console.log('dd', data);
                      return <div>{data.i}</div>;
                    }
                  });
                })} */}
                {/* offers end */}
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
