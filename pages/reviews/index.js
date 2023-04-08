import { useIntl } from 'react-intl';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import ReviewsHeader from 'components/reviews/header';
import ReviewsContent from 'components/reviews/content';
import { SessionProvider } from 'next-auth/react';
import Auth from 'components/reviews/auth';
import { reviewsPerPage } from '/utils/constants';
import { getReviews, getPageSettings } from '/utils/fetch';
import styles from 'components/privacypolicy/content.module.css';

export default function Reviews({ data }) {
  const intl = useIntl();
  const br_arr = [{ title: intl.formatMessage({ id: 'reviews.br' }) }];
  const pagesCount = Math.ceil(data?.meta.filter_count / reviewsPerPage);
  return (
    <>
      <SeoHead content={data.pageSettings.data} />
      <div className="container">
        <Breadcrumbs data={br_arr} />
        <ReviewsHeader />
        <SessionProvider>
          <Auth />
        </SessionProvider>
        <ReviewsContent
          pagesCount={pagesCount}
          data={data}
          curr={1}
          filter={data?.query ? data.query : null}
        />
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{
            __html: data.pageSettings.data?.translations[0]?.content,
          }}
        />
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const loc = ctx.locale;

  const text = 'translations.content';
  const pageSettings = await getPageSettings('reviews_page', loc, text);
  if (pageSettings.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', pageSettings?.errors);
    throw new Error('TEST ERROR');
  }

  const page = 1;
  const limit = reviewsPerPage;
  const filter = ctx.query.f ? ctx.query.f : null;
  const data = await getReviews(page, limit, filter);

  if (ctx.query.f) {
    data.query = ctx.query.f;
  }

  data.pageSettings = pageSettings;

  return { props: { data } };
}
