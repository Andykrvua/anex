import { useIntl } from 'react-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { links } from 'utils/links';
import BlogContent from 'components/blog/blog';
import DefaultErrorPage from 'next/error';
import { blogApi } from 'utils/constants';
import { getCountrySlug, getPostsFromCountry, getCountries, getCategories } from 'utils/fetch';
import { GetLangField } from 'utils/getLangField';

export default function Country({ postsList, categoryList, loc, slug, countryList }) {
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
  countryList.map((item) => {
    if (item.slug === slug) {
      return (name = GetLangField(item.translations, 'languages_code', 'name', loc));
    }
  });

  // if el > 1, last el need only title
  const br_arr = [{ url: links.blog, title: intl.formatMessage({ id: 'links.blog' }) }, { title: name }];

  const pagesCount = Math.ceil(postsList?.meta.filter_count / blogApi.announceLimit);

  const current = 1;
  const searchSlug = countryList.map((item) => item.slug === slug);

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
          firstPageUrl={`${links.blog_country}/${slug}`}
          active={slug}
        />
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const objCountrySlug = await getCountrySlug();

  if (objCountrySlug.errors) {
    // if server down and incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', objCountrySlug.errors);
    throw new Error('ERROR BLOG COUNTRY SLUG');
    // return {
    //   notFound: true,
    // };
  }

  const rawCountrySlugs = objCountrySlug.data;

  for (let i = 0; i < rawCountrySlugs.length; i++) {
    const pagesCount = Math.ceil(rawCountrySlugs[i].posts.length / blogApi.announceLimit);

    rawCountrySlugs[i].posts = [];

    Array(pagesCount)
      .fill(null)
      .map((_, ind) => {
        return rawCountrySlugs[i].posts.push(ind + 2);
      });
    rawCountrySlugs[i].posts.pop();
  }

  const paths = [];
  rawCountrySlugs.map((item) => {
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

  const postsList = await getPostsFromCountry(slug, page);
  const resCategoryList = await getCategories();
  const resCountryList = await getCountries();

  if (postsList.errors || resCategoryList.errors || resCountryList.errors) {
    // if server down and incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', postsList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', resCategoryList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', resCountryList?.errors);
    throw new Error('ERROR BLOG COUNTRY SLUG2');
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
