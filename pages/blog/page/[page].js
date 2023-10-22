import { useIntl } from 'react-intl';
import Head from 'next/head';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import { useRouter } from 'next/router';
import BlogContent from 'components/blog/blog';
import DefaultErrorPage from 'next/error';
import { getPostsMeta, getPostsList, getCategories, getCountries } from 'utils/fetch';

export default function Blog({ postsList, categoryList, loc, current, countryList }) {
  const intl = useIntl();

  //нужно для передачи в HEAD
  const title = intl.formatMessage({ id: 'nav.tour' });
  const description = intl.formatMessage({
    id: 'nav.country',
  });

  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container">
        <div>loading...</div>
      </div>
    );
  }

  // if el > 1, last el need only title
  const br_arr = [
    { url: links.blog, title: intl.formatMessage({ id: 'links.blog' }) },
    { title: intl.formatMessage({ id: 'page' }) + ' ' + current },
  ];

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

  const pagesCount = Math.ceil(postsList?.meta?.filter_count / blogApi.announceLimit);

  return (
    <>
      <Head>
        <title>Anex Blog</title>
        <meta name="description" content="Anex Main" />
      </Head>
      {!router.isFallback && (!postsList?.meta || pagesCount < current) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
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
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const filter_count = await getPostsMeta();

  if (filter_count.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', filter_count.errors);
    throw new Error(' BLOG PAGE');
  }

  const pages = Math.ceil(filter_count / blogApi.announceLimit);

  const paths = [];
  Array(pages)
    .fill(null)
    .map((_, ind) => {
      return locales.map((locale) => {
        return paths.push({
          params: { page: (ind + 1).toString() },
          locale,
        });
      });
    });

  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const current = context.params.page;

  if (isNaN(current)) {
    return {
      notFound: true,
    };
  }

  const loc = context.locale;

  const postsList = await getPostsList(current);
  const categoryList = await getCategories();
  const resCountryList = await getCountries();

  if (postsList.errors || categoryList.errors || resCountryList.errors) {
    // if server down and incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', postsList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', postsList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', resCountryList.errors);
    throw new Error('ERROR BLOG PAGE');
    // return {
    //   notFound: true,
    // };
  }

  const countryList = resCountryList.data;

  return {
    props: {
      postsList,
      categoryList: categoryList.data,
      loc,
      current,
      countryList,
    },
    revalidate: 30,
  };
}
