import styles from './popularCountry.module.css';
import Carousel from '../common/carousel/carousel';
import { carouselInstance } from '../../utils/constants';
import { FormattedMessage as FM } from 'react-intl';

export default function PopularCountry({ data, minOffer }) {
  return (
    <div className={styles.popcountry_wrapper}>
      <h2 className={`${styles.title} block_title`}>
        <FM id="main.pop_country" />
      </h2>
      <Carousel
        data={data}
        instance={carouselInstance.popularCountry}
        minOffer={minOffer && minOffer.length ? minOffer : null}
      />
    </div>
  );
}
