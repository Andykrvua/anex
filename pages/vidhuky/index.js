import { useIntl } from 'react-intl';
import Head from 'next/head';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import BlogContent from 'components/blog/blog';
import { getPostsList, getCategories, getCountries } from 'utils/fetch';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import Pagination from 'components/blog/pagination';
import ReviewsHeader from 'components/reviews/header';
import ReviewsContent from 'components/reviews/content';
import { SessionProvider } from 'next-auth/react';
import Auth from 'components/reviews/auth';

export default function Reviews({ data }) {
  const intl = useIntl();
  console.log(data);

  const br_arr = [{ title: intl.formatMessage({ id: 'reviews.br' }) }];

  const pagesCount = Math.ceil(data?.meta.filter_count / 3);

  // const current = 1;

  return (
    <>
      <SeoHead content={null} />
      <div className="container">
        <Breadcrumbs data={br_arr} />
        <SessionProvider>
          <Auth />
        </SessionProvider>

        <ReviewsHeader />

        <ReviewsContent data={data.data} />
        <Pagination
          curr={1}
          pagesCount={pagesCount}
          firstPageUrl={'/vidhuky'}
        />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://a-k.name/directus/items/reviews?meta=*&page=1&limit=3&sort=sort,-date&filter[status]=published`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}
