import { useIntl } from 'react-intl';
import Head from 'next/head';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import BlogContent from 'components/blog/blog';
import { getPostsList, getCategories, getCountries } from 'utils/fetch';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import ReviewsHeader from 'components/reviews/header';
import ReviewsContent from 'components/reviews/content';
import { SessionProvider } from 'next-auth/react';
import Auth from 'components/reviews/auth';
import { reviewsPerPage } from '/utils/constants';

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
  const res = await fetch(
    `https://a-k.name/directus/items/reviews?meta=*&page=1&limit=${reviewsPerPage}&sort=${
      ctx.query.f ? `-img,-date_created` : `-date_created`
    }&filter[status]=published`
  );

  const data = await res.json();
  if (ctx.query.f) {
    data.query = ctx.query.f;
  }

  return { props: { data } };
}
