import styles from './content.module.css';
import { useIntl } from 'react-intl';
import ReviewsFilter from 'components/reviews/filter';

const Review = ({ data }) => {
  return (
    <div className={styles.review}>
      <div className={styles.review_header}>
        <img
          src="https://cdn.tolstoycomments.com/ui/88/62/39/886239fd-d91a-471f-926e-9dba496ac92b.png"
          alt=""
        />
        <p>{data.name}</p>
        <span>{data.date}</span>
      </div>
      <div className={styles.review_content}>{data.content}</div>
    </div>
  );
};

export default function ReviewsContent({ data }) {
  const intl = useIntl();
  return (
    <>
      <ReviewsFilter />
      <div className={styles.reviews_wrapper}>
        {data.map((item) => (
          <Review key={item.id} data={item} />
        ))}
      </div>
    </>
  );
}
