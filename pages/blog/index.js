import { useIntl } from 'react-intl';
import Head from 'next/head';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import BlogContent from 'components/blog/blog';
import { getPostsList, getCategories, getCountries } from 'utils/fetch';

export default function Blog({ postsList, categoryList, loc, countryList }) {
  const intl = useIntl();

  //нужно для передачи в HEAD
  const title = intl.formatMessage({ id: 'nav.tour' });
  const description = intl.formatMessage({
    id: 'nav.country',
  });

  // if el > 1, last el need only title
  const br_arr = [{ title: intl.formatMessage({ id: 'links.blog' }) }];

  const pagesCount = Math.ceil(
    postsList?.meta.filter_count / blogApi.announceLimit
  );

  const current = 1;

  return (
    <>
      <Head>
        <title>Anex Blog</title>
        <meta name="description" content="Anex Main" />
      </Head>
      <BlogContent
        br_arr={br_arr}
        categoryListItems={categoryList}
        countryListItems={countryList}
        postsList={postsList}
        loc={loc}
        curr={current}
        pagesCount={pagesCount}
        firstPageUrl={links.blog}
      />
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;
  const page = 1;
  const postsList = await getPostsList(page);
  const resCategoryList = await getCategories();
  const resCountryList = await getCountries();

  if (postsList.errors || resCategoryList.errors || resCountryList.errors) {
    // if server down and incorrect request
    console.log('error: ', postsList?.errors);
    console.log('error: ', resCategoryList?.errors);
    console.log('error: ', resCountryList.errors);
    throw new Error('TEST ERROR');
    // return {
    //   notFound: true,
    // };
  }

  const categoryList = resCategoryList.data;
  const countryList = resCountryList.data;

  return {
    props: { postsList, categoryList, loc, countryList },
    revalidate: 30,
  };
}
