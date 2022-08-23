import styles from './content.module.css';
import { useIntl } from 'react-intl';

const Review = ({ data }) => {
  return (
    <div className={styles.review}>
      <div className={styles.review_header}>
        <img
          style={{ width: '36px', height: '36px', borderRadius: '50%' }}
          src="https://cdn.tolstoycomments.com/ui/88/62/39/886239fd-d91a-471f-926e-9dba496ac92b.png"
          alt=""
        />
        {data.name}
        <span>{data.date}</span>
      </div>
      <div className={styles.review_content}>{data.content}</div>
    </div>
  );
};

export default function ReviewsContent({ data }) {
  const intl = useIntl();
  return (
    <div className={styles.reviews_wrapper}>
      {data.map((item) => (
        <Review key={item.id} data={item} />
      ))}
    </div>
  );
}
