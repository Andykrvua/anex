import { useIntl } from 'react-intl';
import Head from 'next/head';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import BlogContent from 'components/blog/blog';
import { getPostsList, getCategories, getCountries } from 'utils/fetch';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import ReviewsContent from 'components/reviews/content';
import { reviewsPerPage } from '/utils/constants';
import DefaultErrorPage from 'next/error';

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

  const res = await fetch(
    `https://a-k.name/directus/items/reviews?meta=*&page=${
      ctx.query.page
    }&limit=${reviewsPerPage}&sort=${
      ctx.query.f ? `-img,-date_created` : `-date_created`
    }&filter[status]=published`
  );
  const data = await res.json();
  if (ctx.query.f) {
    data.query = ctx.query.f;
  }

  return { props: { data, page: ctx.query.page } };
}
