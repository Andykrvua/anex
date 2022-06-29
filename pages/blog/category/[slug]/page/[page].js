import { useIntl } from 'react-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { server } from 'utils/utils';
import { links } from 'utils/links';
import BlogContent from 'components/blog/blog';
import DefaultErrorPage from 'next/error';
import { blogApi } from 'utils/constants';

export default function Post({ postsList, categoryList, loc, current, slug }) {
  const intl = useIntl();
  console.log(postsList);

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
    postsList?.meta?.filter_count / blogApi.announceLimit
  );

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
  console.log('ssasdsda');
  // const pagesCount = Math.ceil(
  //   postsList?.meta.filter_count / blogApi.announceLimit
  // );

  console.log('ssaa', objCatSlug);

  const paths = [];
  objCatSlug.rawCatSlugs.map((item) => {
    return item.posts.map((posts) => {
      return locales.map((locale) => {
        return paths.push({
          params: { slug: item.slug, page: posts.toString() },
          locale,
        });
      });
    });
  });
  // console.log('ssaa', paths);
  // http://localhost:3000/blog/category/helpful-hints/page/2
  // const paths = [{ params: { slug: 'helpful-hints', page: '2' } }];
  // console.log('paths', paths);

  return { paths, fallback: true };

  // const resPostsMeta = await fetch(`${server}/api/posts`);
  // const postsMeta = await resPostsMeta.json();

  // const pages = Math.ceil(postsMeta.filter_count / blogApi.announceLimit);

  // const paths = [];
  // Array(pages)
  //   .fill(null)
  //   .map((_, ind) => {
  //     return locales.map((locale) => {
  //       return paths.push({
  //         params: { page: (ind + 1).toString() },
  //         locale,
  //       });
  //     });
  //   });

  // return { paths, fallback: true };
}

export async function getStaticProps(context) {
  console.log('context', context);
  const { page, slug } = context.params;

  const loc = context.locale;
  const resPostsCat = await fetch(
    `${server}/api/category/${slug}?page=${page}`
  );

  if (resPostsCat.status !== 200) {
    // if server down
    console.log('error: ', resPostsCat.status);
    return {
      notFound: true,
    };
  }

  const postsCat = await resPostsCat.json();
  console.log('postsCat', postsCat);
  const { postsList, categoryList } = postsCat;

  if (postsList.errors) {
    // if incorrect slug
    console.log('error: ', postsList.errors);
    return {
      notFound: true,
    };
  }

  return {
    props: { postsList, categoryList, loc, current: page, slug },
    revalidate: 30,
  };

  // const current = context.params.page;
  // const loc = context.locale;
  // const resPosts = await fetch(`${server}/api/posts/${current}`);

  // if (resPosts.status !== 200) {
  //   // if server down
  //   console.log('error: ', resPosts.status);
  //   return {
  //     notFound: true,
  //   };
  // }

  // const posts = await resPosts.json();
  // const { postsList, categoryList } = posts;

  // if (postsList.errors) {
  //   // if incorrect slug
  //   console.log('error: ', posts.postsList.errors);
  //   return {
  //     notFound: true,
  //   };
  // }

  // return {
  //   props: { postsList, categoryList, loc, current },
  //   revalidate: 30,
  // };
}
