import { useIntl } from 'react-intl';
import Head from 'next/head';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import BlogContent from 'components/blog/blog';
import { getPostsList, getCategories, getCountries } from 'utils/fetch';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import Pagination from 'components/blog/pagination';
import ReviewsContent from 'components/reviews/content';

export default function Reviews({ data, page }) {
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
        <ReviewsContent data={data.data} />
        <Pagination
          curr={page}
          pagesCount={pagesCount}
          firstPageUrl={'/vidhuky'}
        />
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const res = await fetch(
    `https://a-k.name/directus/items/reviews?meta=*&page=${ctx.query.page}&limit=3&sort=sort,-date&filter[status]=published`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data, page: ctx.query.page } };
}
