import { useIntl } from 'react-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getPostsSlugs, getPostFromSlug, getLastPost } from 'utils/fetch';
import { links } from 'utils/links';
import DefaultErrorPage from 'next/error';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { directusFormattedDate } from 'utils/formattedDate';
import { GetLangField } from 'utils/getLangField';
import PostContent from 'components/blog/post';
import Blog from '/components/mainpage/blog.js';
import Carousel from '/components/common/carousel/carousel';
import { carouselInstance } from '/utils/constants';

const blogData = [
  {
    title: 'Хургада или Шарм-эль-Шейх: где лучше отдыхать?',
    badge: 'Полезные советы',
    badge_bg: 'var(--green-badge)',
    link: '/index2',
    image: '/assets/img/fake_data/country1.webp',
  },
  {
    title:
      'Бали открывается для туристов c 4 февраля: какие ограничения действуют?',
    badge: 'Новости',
    badge_bg: 'var(--orange-badge)',
    link: '/index2',
    image: '/assets/img/fake_data/country2.webp',
  },
  {
    title: 'Летим исследовать Таиланд',
    badge: 'Акции',
    badge_bg: 'var(--blue-badge)',
    link: '/index2',
    image: '/assets/img/fake_data/country3.webp',
  },
  {
    title: '5 нестандартных курортов Египта, где вы еще не побывали',
    badge: 'Полезные советы',
    badge_bg: 'var(--green-badge)',
    link: '/index2',
    image: '/assets/img/fake_data/country4.webp',
  },
  {
    title: 'Полетка расширяется: летим почти на 100 курортов этим летом!',
    badge: 'Новости',
    badge_bg: 'var(--orange-badge)',
    link: '/index2',
    image: '/assets/img/fake_data/country5.webp',
  },
  {
    title: 'Хургада или Шарм-эль-Шейх: где лучше отдыхать?',
    badge: 'Полезные советы',
    badge_bg: 'var(--green-badge)',
    link: '/index2',
    image: '/assets/img/fake_data/country1.webp',
  },
];

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
  console.log(postsList);
  console.log(blogData);
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
      {!router.isFallback && !searchSlug.includes(true) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div className="container">
          <Breadcrumbs data={br_arr} />
          <PostContent post={post} loc={loc} />
          <h3 style={styles}>Читайте также</h3>
          {postsList.length && (
            <Carousel data={postsList} instance={carouselInstance.blog} />
          )}
        </div>
      )}
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
  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const loc = context.locale;

  const post = await getPostFromSlug(slug, loc);
  const limit = 3;
  const postsList = await getLastPost(limit, loc, slug);
  const postsSlugs = await getPostsSlugs();

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
