import styles from './header.module.css';
import { useIntl } from 'react-intl';

export default function ReviewsHeader() {
  const intl = useIntl();
  return (
    <div className={styles.reviews_wrapper}>
      <h1 className={styles.title}>
        {intl.formatMessage({ id: 'reviews.br' })}
        <span>{intl.formatMessage({ id: 'reviews.header.title' })}</span>
      </h1>
      <p>{intl.formatMessage({ id: 'reviews.header.p1' })}</p>
      <ul>
        <li>{intl.formatMessage({ id: 'reviews.header.list.i1' })}</li>
        <li>{intl.formatMessage({ id: 'reviews.header.list.i2' })}</li>
        <li>{intl.formatMessage({ id: 'reviews.header.list.i3' })}</li>
      </ul>
      <p>{intl.formatMessage({ id: 'reviews.header.p2' })}</p>
    </div>
  );
}
