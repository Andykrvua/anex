import { useIntl } from 'react-intl';
import { links } from 'utils/links';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import ReviewsContent from 'components/reviews/content';
import { reviewsPerPage } from '/utils/constants';
import DefaultErrorPage from 'next/error';
import { getReviews } from '/utils/fetch';

export default function Reviews({ data, page }) {
  const intl = useIntl();
  const br_arr = [
    { url: links.reviews, title: intl.formatMessage({ id: 'reviews.br' }) },
    { title: intl.formatMessage({ id: 'page' }) + ' ' + page },
  ];
  const pagesCount = Math.ceil(data?.meta.filter_count / reviewsPerPage);

  return (
    <>
      {pagesCount < parseInt(page) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <>
          <SeoHead content={null} />
          <div className="container">
            <Breadcrumbs data={br_arr} />
            <ReviewsContent
              pagesCount={pagesCount}
              data={data}
              curr={page}
              filter={data?.query ? data.query : null}
            />
          </div>
        </>
      )}
    </>
  );
}

export async function getServerSideProps(ctx) {
  if (isNaN(ctx.query.page)) {
    return {
      notFound: true,
    };
  }

  const page = ctx.query.page;
  const limit = reviewsPerPage;
  const filter = ctx.query.f ? ctx.query.f : null;
  const data = await getReviews(page, limit, filter);

  if (ctx.query.f) {
    data.query = ctx.query.f;
  }

  return { props: { data, page: ctx.query.page } };
}
