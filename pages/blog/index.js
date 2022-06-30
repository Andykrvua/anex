import { useIntl } from 'react-intl';
import Head from 'next/head';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import BlogContent from 'components/blog/blog';
import { getPostsList, getCategories } from 'utils/fetch';

export default function Blog({ postsList, categoryList, loc }) {
  const intl = useIntl();

  //нужно для передачи в HEAD
  const title = intl.formatMessage({ id: 'nav.tour' });
  const description = intl.formatMessage({
    id: 'nav.country',
  });

  const br_arr = [{ url: links.blog, title: 'links.blog' }];

  const categoryListItems = [
    { url: '/itemdsa1', title: 'Полезные советы' },
    { url: '/itexzm1', title: 'Акции' },
    { url: '/itezhgfm1', title: 'Новости' },
    { url: '/545item1', title: 'Полезные советы' },
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
        tagsCountryListItems={tagsCountryListItems}
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

  if (postsList.errors || categoryList.errors) {
    // if server down and incorrect request
    console.log('error: ', postsList?.errors);
    console.log('error: ', postsList?.errors);
    throw new Error('TEST ERROR');
    // return {
    //   notFound: true,
    // };
  }

  return {
    props: { postsList, categoryList: categoryList.data, loc },
    revalidate: 30,
  };
}
