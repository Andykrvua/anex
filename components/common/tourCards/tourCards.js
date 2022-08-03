import styles from './tourCards.module.css';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import { useSetModal } from 'store/store';
import ratingColor from 'utils/ratingColor';

export default function TourCards({ current, cards }) {
  const setModal = useSetModal();

  return (
    <div className={styles.cards_wrapper}>
      {cards[current].map((item) => {
        return (
          <div className={styles.card} key={item.id}>
            <div className={styles.card_img}>
              <Image
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
              />
            </div>
            <div className={styles.card_text}>
              <p className={styles.country_text}>
                {`${item.country}, ${item.district}`}
              </p>
              {new Array(parseInt(item.stars)).fill(null).map((_, ind) => {
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
              <h4 className={styles.hotel_name}>{item.hotelName}</h4>
              <div className={styles.tour_propertys}>
                {item.propertys.map((property) => {
                  return (
                    <div className={styles.tour_property} key={property.icon}>
                      <img
                        className={styles.tour_property__icon}
                        src={`/assets/img/svg/tour_property/${property.icon}.svg`}
                        alt=""
                      />
                      <p className={styles.tour_property__title}>
                        {property.title}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className={styles.maps_and_options}>
                <button onClick={() => setModal(true)} className={styles.maps}>
                  <img src="/assets/img/svg/tour/map-marker.svg" alt="map" />
                  <span>Отель на карте</span>
                </button>
                <p className={styles.options}>{item.description}</p>
              </div>
              {item.rating && (
                <div className={styles.review}>
                  {!item.reviews && <p>Рейтинг</p>}
                  <p
                    className={styles.review__number}
                    style={{ color: ratingColor(parseFloat(item.rating)) }}
                  >
                    {item.rating}
                  </p>
                  {item.reviews && <p>Отзывов:</p>}
                  {item.reviews && (
                    <p className={styles.review__medium}>{item.reviews}</p>
                  )}
                </div>
              )}
            </div>
            <a className={styles.card_order} href="">
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
            </a>
          </div>
        );
      })}
    </div>
  );
}
