import styles from './favorites.module.css';
import { useIntl, FormattedMessage as FM } from 'react-intl';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import ratingColor from 'utils/ratingColor';
import SimpleBar from 'simplebar-react';
import CloseSvg from 'components/common/closeSvg';
import { useState } from 'react';

export default function Favorites() {
  const [cards, setCards] = useState(JSON.parse(localStorage.getItem('favorites') || '[]'));
  const intl = useIntl();

  const deleteFavorites = (id) => {
    setCards([...cards.filter((item) => item.id !== id)]);
    localStorage.setItem('favorites', JSON.stringify(cards.filter((item) => item.id !== id)));
  };

  return (
    <SimpleBar
      style={{
        minWidth: '320px',
        maxHeight: '80vh',
        margin: '-20px',
      }}
    >
      <div className={styles.fav_list}>
        {cards.map((item) => {
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
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(333, 240))}`}
                />
                <button
                  className={`${styles.delete_favorites} svg_btn svg_btn_stroke`}
                  aria-label="Закрыть"
                  onClick={() => deleteFavorites(item.id)}
                >
                  <CloseSvg />
                </button>
              </div>
              <div className={styles.card_text}>
                <p className={styles.country_text}>{`${item.country}, ${item.district}`}</p>
                {new Array(parseInt(item.stars)).fill(null).map((_, ind) => {
                  return (
                    <div className={styles.stars} key={ind}>
                      <img src="/assets/img/svg/tour/star.svg" alt="star" width="12" height="12" />
                    </div>
                  );
                })}
                <h4 className={styles.hotel_name}>{item.hotelName}</h4>
                <div className={styles.maps_and_options}>
                  <p className={styles.options}>{item.description}</p>
                </div>
                {/* {item.rating > 0 && (
                  <div className={styles.review}>
                    {!item.reviews && <p>Рейтинг</p>}
                    <p
                      className={styles.review__number}
                      style={{ color: ratingColor(parseFloat(item.rating)) }}
                    >
                      {item.rating}
                    </p>
                    {item.reviews && <p>Отзывов:</p>}
                    {item.reviews && <p className={styles.review__medium}>{item.reviews}</p>}
                  </div>
                )} */}
              </div>
              {item.orders.map((order, ind) => {
                return (
                  <a className={styles.card_order} href={order.link} key={ind}>
                    <span className={styles.order_text_wrapper}>
                      <span className={styles.order_text__duration}>
                        <span>
                          {order.start}-{order.end}
                        </span>
                        <br />
                        <span>{order.n}</span>
                      </span>
                      <span className={styles.order_text__people}>
                        <span> {order.r}</span>
                      </span>
                    </span>
                    <span className={styles.order_price}>
                      {order.price}
                      <img src="/assets/img/svg/arrow.svg" alt="" />
                    </span>
                  </a>
                );
              })}
            </div>
          );
        })}
        {!cards.length && (
          <div style={{ textAlign: 'center' }}>
            <FM id="favorites.empty" />
          </div>
        )}
      </div>
    </SimpleBar>
  );
}

// const cards = [
//   {
//     id: 0,
//     img: '/assets/img/fakedata/1.jpg',
//     hotelName: 'Carmen Suite Hotel',
//     stars: '5',
//     country: 'Турция',
//     district: 'Алания',
//     rating: '7.4',
//     reviews: '113',
//     description: 'Завтрак, за 2-х с перелетом',
//     order: [
//       {
//         duration: '4',
//         people: '2',
//         price: '128800',
//         link: 'https://www.google.com/',
//       },
//     ],
//   },
//   {
//     id: 1,
//     img: '/assets/img/fakedata/2.jpg',
//     hotelName: 'Grand Atilla',
//     stars: '2',
//     country: 'Египет',
//     district: 'Шейх Аль-Фараби',
//     rating: '6.2',
//     reviews: '1',
//     propertys: [
//       { icon: '2line', title: '2-я линия' },
//       { icon: 'sandy-pebble-beach', title: 'песчано галечный пляж' },
//     ],
//     description: 'Всё включено, за 2-х с перелетом',
//     order: [
//       {
//         duration: '4',
//         people: '2',
//         price: '75400',
//         link: 'https://www.google.com/',
//       },
//     ],
//   },
//   {
//     id: 2,
//     img: '/assets/img/fakedata/3.jpg',
//     hotelName:
//       'Maldives Beach Hotel (Your Ideal Hotel in Baa Atoll at a Great Price)',
//     stars: '4',
//     country: 'Китай',
//     district: 'Пхеньян',
//     rating: '9.6',
//     reviews: null,
//     description: 'Без питания, за 2-х с перелетом',
//     order: [
//       {
//         duration: '4',
//         people: '2',
//         price: '22500',
//         link: 'https://www.google.com/',
//       },
//     ],
//   },
//   {
//     id: 3,
//     img: '/assets/img/fakedata/3.jpg',
//     hotelName:
//       'Maldives Beach Hotel (Your Ideal Hotel in Baa Atoll at a Great Price)',
//     stars: '4',
//     country: 'Китай',
//     district: 'Пхеньян',
//     rating: '4.1',
//     reviews: null,
//     description: 'Без питания, за 2-х с перелетом',
//     order: [
//       {
//         duration: '4',
//         people: '2',
//         price: '225300',
//         link: 'https://www.google.com/',
//       },
//     ],
//   },
//   {
//     id: 4,
//     img: '/assets/img/fakedata/3.jpg',
//     hotelName:
//       'Maldives Beach Hotel (Your Ideal Hotel in Baa Atoll at a Great Price)',
//     stars: '4',
//     country: 'Китай',
//     district: 'Пхеньян',
//     rating: '5.7',
//     reviews: null,
//     description: 'Без питания, за 2-х с перелетом',
//     order: [
//       {
//         duration: '4',
//         people: '2',
//         price: '225300',
//         link: 'https://www.google.com/',
//       },
//     ],
//   },
// ];
