import { useIntl } from 'react-intl';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { getAPICountryListSlugs, getCountryFromSlug } from 'utils/fetch';
import { links } from 'utils/links';
import DefaultErrorPage from 'next/error';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import styles from 'components/blog/postList.module.css';
import { directusFormattedDate } from 'utils/formattedDate';
import { GetLangField } from 'utils/getLangField';
import PostContent from 'components/blog/post';

export default function Country({ country, countrySlugs, slug }) {
  const intl = useIntl();

  const router = useRouter();

  if (router.isFallback) {
    console.log('searchSlug: ');
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

  const searchSlug = countrySlugs.data.map((item) => item.slug === slug);

  const br_arr = [
    { url: links.blog, title: intl.formatMessage({ id: 'links.blog' }) },
    { title: country?.translations[0].title },
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
          {/* <CountryContent country={country} /> */}
        </div>
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const countrySlugs = await getAPICountryListSlugs();

  const paths = [];
  countrySlugs.data.map((item) => {
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

  const country = await getCountryFromSlug(slug, loc);
  const countrySlugs = await getAPICountryListSlugs();

  if (country.errors) {
    // if server down and incorrect request
    console.log('error: ', country?.errors);
    throw new Error('TEST ERROR');
    // return {
    //   notFound: true,
    // };
  }

  return {
    props: {
      country: country.data[0] || null,
      countrySlugs,
      slug,
    },
    revalidate: 30,
  };
}
