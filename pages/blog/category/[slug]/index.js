import { useIntl } from 'react-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { server } from 'utils/utils';
import { links } from 'utils/links';
import BlogContent from 'components/blog/blog';
import DefaultErrorPage from 'next/error';
import { blogApi } from 'utils/constants';

export default function Post({ postsList, categoryList, loc, slug }) {
  const intl = useIntl();
  console.log(postsList);
  console.log(categoryList);

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
    postsList?.meta.filter_count / blogApi.announceLimit
  );

  const current = 1;

  return (
    <>
      <Head>
        <title>Anex Main</title>
        <meta name="description" content="Anex Main" />
      </Head>
      {/* {!router.isFallback && postsList?.meta?.filter_count < current ? (
        <DefaultErrorPage statusCode={404} />
      ) : ( */}
      <BlogContent
        br_arr={br_arr}
        categoryListItems={categoryList}
        tagsCountryListItems={tagsCountryListItems}
        postsList={postsList}
        loc={loc}
        curr={current}
        pagesCount={pagesCount}
        firstPageUrl={`${links.blog_category}/${slug}`}
      />
      {/* )} */}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const resCatSlug = await fetch(`${server}/api/category`);
  const objCatSlug = await resCatSlug.json();

  const paths = [];
  objCatSlug.rawCatSlugs.map((item) => {
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
  console.log('slug', slug);

  const resPostsCat = await fetch(`${server}/api/category/${slug}`);

  if (resPostsCat.status !== 200) {
    // if server down
    console.log('error: ', resPostsCat.status);
    return {
      notFound: true,
    };
  }

  const postsCat = await resPostsCat.json();
  const { postsList, categoryList } = postsCat;

  if (postsList.errors) {
    // if incorrect slug
    console.log('error: ', postsList.errors);
    return {
      notFound: true,
    };
  }

  return {
    props: { postsList, categoryList, loc, slug },
    revalidate: 30,
  };
}
