import styles from './content.module.css';
import { useIntl } from 'react-intl';
import ReviewsFilter from 'components/reviews/filter';
import Pagination from 'components/blog/pagination';
import { links } from 'utils/links';

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

export default function ReviewsContent({ data, curr }) {
  const pagesCount = Math.ceil(data?.meta.filter_count / 3);
  return (
    <>
      <ReviewsFilter />
      <div className={styles.reviews_wrapper}>
        {data.data.map((item) => (
          <Review key={item.id} data={item} />
        ))}
      </div>
      <Pagination
        curr={curr}
        pagesCount={pagesCount}
        firstPageUrl={links.reviews}
      />
    </>
  );
}
