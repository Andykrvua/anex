import styles from './tourCards.module.css';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';

// img width = 360
export const cards = [
  {
    id: 0,
    img: '/assets/img/fakedata/1.jpg',
    hotelName: 'Carmen Suite Hotel',
    stars: '5',
    country: 'Турция',
    district: 'Алания',
    rating: '7.4',
    reviews: '113',
    propertys: [
      { icon: '3line', title: '1-я линия' },
      { icon: 'sand-beach', title: 'песчаный пляж' },
    ],
    description: 'Завтрак, за 2-х с перелетом',
    order: [{ duration: '7 ночей', people: '3 туриста', price: '35 249 грн' }],
    link: 'https://www.google.com/',
  },
  {
    id: 1,
    img: '/assets/img/fakedata/2.jpg',
    hotelName: 'Grand Atilla',
    stars: '2',
    country: 'Египет',
    district: 'Шейх Аль-Фараби',
    rating: '6.2',
    reviews: '1',
    propertys: [
      { icon: '2line', title: '2-я линия' },
      { icon: 'sandy-pebble-beach', title: 'песчано галечный пляж' },
    ],
    description: 'Всё включено, за 2-х с перелетом',
    order: [{ duration: '9 ночей', people: '5 туристов', price: '42 157 грн' }],
    link: 'https://www.google.com/',
  },
  {
    id: 2,
    img: '/assets/img/fakedata/3.jpg',
    hotelName:
      'Maldives Beach Hotel (Your Ideal Hotel in Baa Atoll at a Great Price)',
    stars: '4',
    country: 'Китай',
    district: 'Пхеньян',
    rating: '9.6',
    reviews: null,
    propertys: [
      { icon: '1line', title: '3-я и дальше' },
      { icon: 'sandy-pebble-beach', title: 'песчано галечный пляж' },
    ],
    description: 'Без питания, за 2-х с перелетом',
    order: [{ duration: '4 ночи', people: '2 туриста', price: '64 200 грн' }],
    link: 'https://www.google.com/',
  },
  {
    id: 3,
    img: '/assets/img/fakedata/3.jpg',
    hotelName:
      'Maldives Beach Hotel (Your Ideal Hotel in Baa Atoll at a Great Price)',
    stars: '4',
    country: 'Китай',
    district: 'Пхеньян',
    rating: '9.6',
    reviews: null,
    propertys: [
      { icon: '1line', title: '3-я и дальше' },
      { icon: 'sandy-pebble-beach', title: 'песчано галечный пляж' },
    ],
    description: 'Без питания, за 2-х с перелетом',
    order: [{ duration: '4 ночи', people: '2 туриста', price: '64 200 грн' }],
    link: 'https://www.google.com/',
  },
];

export default function TourCards() {
  return (
    <div className={styles.cards_wrapper}>
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
              <div></div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
