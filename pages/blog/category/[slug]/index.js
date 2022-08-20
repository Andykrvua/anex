import { useIntl } from 'react-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { links } from 'utils/links';
import BlogContent from 'components/blog/blog';
import DefaultErrorPage from 'next/error';
import { blogApi } from 'utils/constants';
import {
  getCategoriesSlug,
  getPostsFromCategory,
  getCategories,
  getCountries,
} from 'utils/fetch';
import { GetLangField } from 'utils/getLangField';

export default function Category({
  postsList,
  categoryList,
  loc,
  slug,
  countryList,
}) {
  const intl = useIntl();

  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container">
        <div>loading...</div>
      </div>
    );
  }

  //нужно для передачи в HEAD
  const title = intl.formatMessage({ id: 'nav.tour' });
  const description = intl.formatMessage({
    id: 'nav.country',
  });

  let name;
  categoryList.map((item) => {
    if (item.slug === slug) {
      return (name = GetLangField(
        item.translations,
        'languages_id',
        'name',
        loc
      ));
    }
  });

  // if el > 1, last el need only title
  const br_arr = [
    { url: links.blog, title: intl.formatMessage({ id: 'links.blog' }) },
    { title: name },
  ];

  const pagesCount = Math.ceil(
    postsList?.meta.filter_count / blogApi.announceLimit
  );

  const current = 1;
  const searchSlug = categoryList.map((item) => item.slug === slug);

  return (
    <>
      <Head>
        <title>Anex Main</title>
        <meta name="description" content="Anex Main" />
      </Head>
      {!router.isFallback && !searchSlug.includes(true) ? (
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
          firstPageUrl={`${links.blog_category}/${slug}`}
          active={slug}
        />
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const objCatSlug = await getCategoriesSlug();

  if (objCatSlug.errors) {
    // if server down and incorrect request
    console.log('error: ', objCatSlug.errors);
    throw new Error('TEST ERROR');
    // return {
    //   notFound: true,
    // };
  }

  const rawCatSlugs = objCatSlug.data;

  for (let i = 0; i < rawCatSlugs.length; i++) {
    const pagesCount = Math.ceil(
      rawCatSlugs[i].posts.length / blogApi.announceLimit
    );

    rawCatSlugs[i].posts = [];

    Array(pagesCount)
      .fill(null)
      .map((_, ind) => {
        return rawCatSlugs[i].posts.push(ind + 2);
      });
    rawCatSlugs[i].posts.pop();
  }

  const paths = [];
  rawCatSlugs.map((item) => {
    return locales.map((locale) => {
      return paths.push({
        params: { slug: item.slug },
        locale,
      });
    });
  });

  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const loc = context.locale;
  const page = 1;

  const postsList = await getPostsFromCategory(slug, page);
  const resCategoryList = await getCategories();
  const resCountryList = await getCountries();

  if (postsList.errors || resCategoryList.errors || resCountryList.errors) {
    // if server down and incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', postsList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', resCategoryList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', resCountryList.errors);
    throw new Error('TEST ERROR');
    // return {
    //   notFound: true,
    // };
  }

  const categoryList = resCategoryList.data;
  const countryList = resCountryList.data;

  return {
    props: { postsList, categoryList, loc, slug, countryList },
    revalidate: 30,
  };
}
