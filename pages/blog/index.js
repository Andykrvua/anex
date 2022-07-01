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

  const tagsCountryListItems = [
    { code: 'DO', title: 'Доминикана', count: 1, url: '/' },
    { code: 'CH', title: 'Швейцария', count: 5, url: '/' },
    { code: 'BG', title: 'Болгария', count: 4, url: '/' },
    { code: 'DO', title: 'Доминикана', count: 1, url: '/' },
    { code: 'CN', title: 'Китай', count: 17, url: '/' },
    { code: 'DO', title: 'Доминикана', count: 1, url: '/' },
    { code: 'AE', title: 'ОАЭ', count: 2, url: '/' },
    { code: 'CH', title: 'Швейцария', count: 5, url: '/' },
    { code: 'DO', title: 'Доминикана', count: 1, url: '/' },
  ];

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
  const categoryList = await getCategories();
  const resCountryList = await getCountries();

  if (postsList.errors || categoryList.errors || resCountryList.errors) {
    // if server down and incorrect request
    console.log('error: ', postsList?.errors);
    console.log('error: ', categoryList?.errors);
    console.log('error: ', resCountryList.errors);
    throw new Error('TEST ERROR');
    // return {
    //   notFound: true,
    // };
  }

  const countryList = resCountryList.data;

  return {
    props: { postsList, categoryList: categoryList.data, loc, countryList },
    revalidate: 30,
  };
}
