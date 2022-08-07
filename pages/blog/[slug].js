import { useIntl } from 'react-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getPostsSlugs, getPostFromSlug, getLastPost } from 'utils/fetch';
import { links } from 'utils/links';
import DefaultErrorPage from 'next/error';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import PostContent from 'components/blog/post';
import Carousel from '/components/common/carousel/carousel';
import { carouselInstance } from '/utils/constants';

const styles = {
  marginTop: 'var(--block-title-top-margin)',
  marginBottom: 'var(--block-top-margin)',
  fontSize: 'var(--title-fz)',
  lineHeight: 'var(--title-lh)',
  fontWeight: 'var(--title-fw)',
  letterSpacing: 'var(--title-ls)',
  textTransform: 'var(--title-tt)',
};

export default function Post({ post, postsList, loc, postsSlugs, slug }) {
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

  const searchSlug = postsSlugs.data.map((item) => item.slug === slug);

  const br_arr = [
    { url: links.blog, title: intl.formatMessage({ id: 'links.blog' }) },
    { title: post?.translations[0].title },
  ];

  return (
    <>
      <Head>
        <title>Anex Main</title>
        <meta name="description" content="Anex Main" />
      </Head>
      {/* {!router.isFallback && !searchSlug.includes(true) ? (
        <DefaultErrorPage statusCode={404} />
      ) : ( */}
      <div className="container">
        <Breadcrumbs data={br_arr} />
        <PostContent post={post} loc={loc} />
        <h3 style={styles}>Читайте также</h3>
        {postsList.length && (
          <Carousel data={postsList} instance={carouselInstance.blog} />
        )}
      </div>
      {/* )} */}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const postsSlugs = await getPostsSlugs();

  const paths = [];
  postsSlugs.data.map((item) => {
    return locales.map((locale) => {
      return paths.push({
        params: { slug: item.slug },
        locale,
      });
    });
  });
  // return { paths, fallback: true };
  console.log('paths', paths);
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const loc = context.locale;

  const post = await getPostFromSlug(slug, loc);
  const limit = 3;
  const postsList = await getLastPost(limit, loc, slug);
  const postsSlugs = await getPostsSlugs();

  console.log('post', post);

  if (post.data.length === 0) {
    return {
      notFound: true,
    };
  }

  if (post.errors || postsList.errors || postsSlugs.errors) {
    // if server down and incorrect request
    console.log('error: ', post?.errors);
    console.log('error: ', postsList?.errors);
    console.log('error: ', postsSlugs?.errors);
    throw new Error('TEST ERROR');
    // return {
    //   notFound: true,
    // };
  }

  return {
    props: {
      post: post.data[0] || null,
      postsList: postsList.data,
      loc,
      postsSlugs,
      slug,
    },
    revalidate: 30,
  };
}