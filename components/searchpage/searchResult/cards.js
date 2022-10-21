import styles from './cards.module.css';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import { useSetModal } from 'store/store';
import ratingColor from 'utils/ratingColor';

export default function Cards({ cards = [], offers = null, step }) {
  console.log(cards);
  console.log(offers);
  const setModal = useSetModal();
  console.log('rr');
  console.log('step', step);

  //   Object.keys(tifs).map(key =>
  //     <option value={key}>{tifs[key]}</option>
  // )

  return (
    <div className={styles.cards_wrapper}>
      {Object.entries(cards).map(([key, item], j) => {
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
                      {item.r}
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
                    return (
                      <div className={styles.tour_property} key={ind}>
                        <img
                          className={styles.tour_property__icon}
                          src={`/assets/img/svg/tour_property/${property.icon}.svg`}
                          alt=""
                        />
                        <p className={styles.tour_property__title}>
                          {property}
                        </p>
                      </div>
                    );
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
                  <p className={styles.options}>{item.description}</p>
                </div>
                {/* offers */}
                {Object.entries(offers).map(([operatorId, value]) => {
                  return Object.entries(value).map(([offerKey, data]) => {
                    if (offerKey === key) {
                      console.log('dd', data);
                      return <div>{data.i}</div>;
                    }
                  });
                })}
                {/* offers end */}
                {/* <a className={styles.card_order} href="">
                <span className={styles.order_text_wrapper}>
                  <span className={styles.order_text__duration}>
                    {item.order[0].duration} <span>ночи</span>
                  </span>
                  <span className={styles.order_text__people}>
                    {item.order[0].people} <span> туриста</span>
                  </span>
                </span>
                <span className={styles.order_price}>
                  {item.order[0].price}
                  <span>&nbsp;грн</span>
                  <img src="/assets/img/svg/arrow.svg" alt="" />
                </span>
              </a> */}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
