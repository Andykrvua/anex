import styles from './blog.module.css';
import Carousel from '../common/carousel/carousel';
import { carouselInstance } from '../../utils/constants';
import Link from 'next/link';
import { FormattedMessage as FM } from 'react-intl';

export default function Blog({ data }) {
  return (
    <div className={styles.blog_wrapper}>
      <div className={styles.blog_header}>
        <h2 className={`${styles.title} block_title`}>
          <FM id="blog" />
        </h2>
        <Link href="/">
          <a className={styles.blog_link}>
            <FM id="blog.links" />
          </a>
        </Link>
      </div>
      <Carousel data={data} instance={carouselInstance.blog} />
    </div>
  );
}
