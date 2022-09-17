import { useIntl } from 'react-intl';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import ReviewsHeader from 'components/reviews/header';
import ReviewsContent from 'components/reviews/content';
import { SessionProvider } from 'next-auth/react';
import Auth from 'components/reviews/auth';
import { reviewsPerPage } from '/utils/constants';
import { getReviews } from '/utils/fetch';

export default function Reviews({ data }) {
  const intl = useIntl();
  const br_arr = [{ title: intl.formatMessage({ id: 'reviews.br' }) }];
  const pagesCount = Math.ceil(data?.meta.filter_count / reviewsPerPage);
  return (
    <>
      <SeoHead content={null} />
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
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const page = 1;
  const limit = reviewsPerPage;
  const filter = ctx.query.f ? ctx.query.f : null;
  const data = await getReviews(page, limit, filter);

  if (ctx.query.f) {
    data.query = ctx.query.f;
  }

  return { props: { data } };
}
