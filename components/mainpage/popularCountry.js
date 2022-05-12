import styles from './popularCountry.module.css';
import Carousel from '../common/carousel/carousel';

export default function PopularCountry({ data }) {
  return (
    <div className={styles.popcountry_wrapper}>
      <h2 className={styles.title}>Популярные направления</h2>
      <div className={styles.carousel_wrapper}>
        <Carousel data={data} />
      </div>
    </div>
  );
}
