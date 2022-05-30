import styles from './popularCountry.module.css';
import Carousel from '../common/carousel/carousel';
import { carouselInstance } from '../../utils/constants';
import { FormattedMessage as FM } from 'react-intl';

export default function PopularCountry({ data }) {
  return (
    <div className={styles.popcountry_wrapper}>
      <h2 className={`${styles.title} block_title`}>
        <FM id="main.pop_country" />
      </h2>
      <div className={styles.carousel_wrapper}>
        <Carousel data={data} instance={carouselInstance.popularCountry} />
      </div>
    </div>
  );
}
