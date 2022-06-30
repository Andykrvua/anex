import { useIntl } from 'react-intl';
import Head from 'next/head';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import { useRouter } from 'next/router';
import BlogContent from 'components/blog/blog';
import DefaultErrorPage from 'next/error';
import { getPostsMeta, getPostsList, getCategories } from 'utils/fetch';

export default function Blog({ postsList, categoryList, loc, current }) {
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

  const br_arr = [{ url: links.blog, title: 'links.blog' }];

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
    postsList?.meta?.filter_count / blogApi.announceLimit
  );

  return (
    <>
      <Head>
        <title>Anex Blog</title>
        <meta name="description" content="Anex Main" />
      </Head>
      {!router.isFallback && postsList?.meta?.filter_count < current ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <BlogContent
          br_arr={br_arr}
          categoryListItems={categoryList}
          tagsCountryListItems={tagsCountryListItems}
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
  console.log('filter_count', filter_count);

  if (filter_count.errors) {
    // if server down and incorrect request
    console.log('error: ', filter_count.errors);
    throw new Error('TEST ERROR');
    // return {
    //   notFound: true,
    // };
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
  const loc = context.locale;

  const postsList = await getPostsList(current);
  const categoryList = await getCategories();
  console.log('categoryList', categoryList);

  if (postsList.errors || categoryList.errors) {
    // if server down and incorrect request
    console.log('error: ', postsList.errors);
    throw new Error('TEST ERROR');
    // return {
    //   notFound: true,
    // };
  }

  return {
    props: { postsList, categoryList: categoryList.data, loc, current },
    revalidate: 30,
  };
}
