import styles from './popularCountry.module.css';
import Carousel from '../common/carousel/carousel';
import viewPortSize from '/utils/getViewport';
import { useLayoutEffect, useState } from 'react';

// change layout on mobile or desktop
const PopCountryCards = ({ size, data }) => {
  const [show, setShow] = useState(false);

  useLayoutEffect(() => {
    if (size.width >= 810) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [size]);

  return <>{show ? <div>dsdd242</div> : <Carousel data={data} />}</>;
};

export default function PopularCountry({ data }) {
  const size = viewPortSize();

  return (
    <div className={styles.popcountry_wrapper}>
      <h2>Популярные направления</h2>
      <div className={styles.carousel_wrapper}>
        <PopCountryCards size={size} data={data} />
      </div>
    </div>
  );
}
