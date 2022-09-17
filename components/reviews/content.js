import styles from './content.module.css';
import ReviewsFilter from 'components/reviews/filter';
import Pagination from 'components/blog/pagination';
import { links } from 'utils/links';
import { useLayoutEffect } from 'react';
import { useState } from 'react';
import 'yet-another-react-lightbox/styles.css';
import dynamic from 'next/dynamic';

function transformName(name) {
  const arr = name.split(' ');

  if (arr.length > 1) {
    const firstWord = arr[0].split('');
    const secondWord = arr[1].split('');
    return `${firstWord[0]}${secondWord[0]}`;
  }
  const res = arr[0].split('');
  return `${res[0]}${res[1]}`;
}

const Review = ({ data }) => {
  const [bg, setBg] = useState('');
  const images = JSON.parse(data.img);
  const [openLightbox, setOpenLightbox] = useState(false);
  let slides = [];
  if (images) {
    slides = images.map((item) => {
      return { src: `${process.env.NEXT_PUBLIC_API_img}${item}` };
    });
  }

  const DynamicLightbox = dynamic(() => import('yet-another-react-lightbox'), {
    ssr: false,
  });

  const openLightboxHandler = async () => {
    // const Lightbox = (await import('yet-another-react-lightbox')).default;
    setOpenLightbox(true);
  };

  useLayoutEffect(() => {
    function getRandom() {
      const min = 1;
      const max = 4;
      const rand = Math.floor(Math.random() * (max - min + 1)) + min;
      const bg = ['#80c683', '#f37572', '#4dc2f6', '#ffb54b'];
      return bg[rand - 1];
    }

    setBg(getRandom());
  }, []);

  return (
    <div className={styles.review}>
      <div className={styles.review_header}>
        {data.ava ? (
          <img src={data.ava} alt="" referrerPolicy="no-referrer" />
        ) : (
          <div className={styles.letter_img} style={{ backgroundColor: bg }}>
            {transformName(data.name)}
          </div>
        )}
        <p>{data.name}</p>
        <span>{data.date.split('-').reverse().join('/')}</span>
      </div>
      <div className={styles.review_content}>
        {data.content}
        <div className={styles.review_content_img_wrapper}>
          {images &&
            images.map((img, ind) => (
              <button
                className={styles.lightbox_btn}
                key={ind}
                onClick={() => openLightboxHandler()}
              >
                <img
                  src={`${process.env.NEXT_PUBLIC_API_img}${img}`}
                  alt="atachment"
                />
              </button>
            ))}
          {images && openLightbox ? (
            <DynamicLightbox
              open={openLightbox}
              close={() => setOpenLightbox(false)}
              slides={slides}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default function ReviewsContent({ data, curr, filter, pagesCount }) {
  return (
    <>
      <ReviewsFilter filter={filter} />
      <div className={styles.reviews_wrapper}>
        {data.data.map((item) => (
          <Review key={item.id} data={item} />
        ))}
      </div>
      <Pagination
        curr={curr}
        pagesCount={pagesCount}
        firstPageUrl={links.reviews}
        filter={filter}
      />
    </>
  );
}
