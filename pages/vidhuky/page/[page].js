import { useIntl } from 'react-intl';
import Head from 'next/head';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import BlogContent from 'components/blog/blog';
import { getPostsList, getCategories, getCountries } from 'utils/fetch';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import ReviewsContent from 'components/reviews/content';

export default function Reviews({ data, page }) {
  const intl = useIntl();

  const br_arr = [
    { url: links.reviews, title: intl.formatMessage({ id: 'reviews.br' }) },
    { title: intl.formatMessage({ id: 'page' }) + ' ' + page },
  ];

  return (
    <>
      <SeoHead content={null} />
      <div className="container">
        <Breadcrumbs data={br_arr} />
        <ReviewsContent data={data} curr={page} />
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const res = await fetch(
    `https://a-k.name/directus/items/reviews?meta=*&page=${ctx.query.page}&limit=3&sort=sort,-date&filter[status]=published`
  );
  const data = await res.json();

  return { props: { data, page: ctx.query.page } };
}
