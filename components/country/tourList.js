import styles from './tourList.module.css';
import SwitchMenu from '/components/common/switchMenu/switchMenu.js';
import TourCards from '/components/common/tourCards/tourCards.js';
import { useState, useMemo } from 'react';

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
    order: [
      {
        duration: '4',
        people: '2',
        price: '128800',
        link: 'https://www.google.com/',
      },
    ],
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
    order: [
      {
        duration: '4',
        people: '2',
        price: '75400',
        link: 'https://www.google.com/',
      },
    ],
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
    order: [
      {
        duration: '4',
        people: '2',
        price: '22500',
        link: 'https://www.google.com/',
      },
    ],
  },
  {
    id: 3,
    img: '/assets/img/fakedata/3.jpg',
    hotelName:
      'Maldives Beach Hotel (Your Ideal Hotel in Baa Atoll at a Great Price)',
    stars: '4',
    country: 'Китай',
    district: 'Пхеньян',
    rating: '4.1',
    reviews: null,
    propertys: [
      { icon: '1line', title: '3-я и дальше' },
      { icon: 'sandy-pebble-beach', title: 'песчано галечный пляж' },
    ],
    description: 'Без питания, за 2-х с перелетом',
    order: [
      {
        duration: '4',
        people: '2',
        price: '225300',
        link: 'https://www.google.com/',
      },
    ],
  },
  {
    id: 4,
    img: '/assets/img/fakedata/3.jpg',
    hotelName:
      'Maldives Beach Hotel (Your Ideal Hotel in Baa Atoll at a Great Price)',
    stars: '4',
    country: 'Китай',
    district: 'Пхеньян',
    rating: '5.7',
    reviews: null,
    propertys: [
      { icon: '1line', title: '3-я и дальше' },
      { icon: 'sandy-pebble-beach', title: 'песчано галечный пляж' },
    ],
    description: 'Без питания, за 2-х с перелетом',
    order: [
      {
        duration: '4',
        people: '2',
        price: '225300',
        link: 'https://www.google.com/',
      },
    ],
  },
];

export default function TourList() {
  const [name, setName] = useState('eco');
  // console.log(name);

  const filter = (cards) => {
    const res = cards.sort((a, b) => a.order[0].price - b.order[0].price);
    const top = res.filter((card) => card.stars === '5');
    let ecoCount, bestCount;

    if (res.length % 2 === 0) {
      ecoCount = res.length / 2;
      bestCount = res.length / 2;
    } else {
      ecoCount = Math.floor(res.length / 2) + 1;
      bestCount = Math.floor(res.length / 2);
    }
    const eco = res.slice(0, ecoCount);
    const best = res.slice(-bestCount);

    return { top, eco, best };
  };

  return (
    <>
      <h2 className={styles.title}>Сейчас заказывают</h2>
      <SwitchMenu
        items={[
          { name: 'Економ', value: 'eco' },
          { name: 'Лучшие', value: 'best' },
          { name: 'Топ 5 звёзд', value: 'top' },
        ]}
        name={'order_switcher'}
        callback={[name, setName]}
      />
      <TourCards current={name} cards={useMemo(() => filter(cards), [cards])} />
    </>
  );
}
