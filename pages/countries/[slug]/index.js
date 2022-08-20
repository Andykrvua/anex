import { useIntl } from 'react-intl';
import SeoHead from '/components/common/seoHead/seoHead.js';
import { useRouter } from 'next/router';
import {
  getAPICountryListSlugs,
  getCountryFromSlug,
  getSubpagesSlugsFromCountry,
} from 'utils/fetch';
import { links } from 'utils/links';
import DefaultErrorPage from 'next/error';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import MainForm from '/components/mainform/mainForm.js';
import H1 from 'components/country/countryPageH1';
import CountryPageContent from 'components/country/countryPageContent';

export default function Country({
  country,
  countrySlugs,
  slug,
  loc,
  subpagesSlugs,
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

  // all false if country slug not found
  const searchSlug = countrySlugs.data.map((item) => item.slug === slug);

  const br_arr = [
    {
      url: links.countries,
      title: intl.formatMessage({ id: 'links.countries' }),
    },
    { title: country?.translations[0].name },
  ];

  return (
    <>
      <SeoHead content={country} />
      {!router.isFallback && !searchSlug.includes(true) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div className="container">
          <Breadcrumbs data={br_arr} beforeMainFrom />
          <H1>{country.translations[0].h1}</H1>
          <MainForm />
          <CountryPageContent
            country={country}
            loc={loc}
            subpagesSlugs={subpagesSlugs}
          />
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
  const subpagesSlugs = await getSubpagesSlugsFromCountry(slug);

  if (country.errors || countrySlugs.errors || subpagesSlugs.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', country?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', countrySlugs?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', subpagesSlugs?.errors);
    throw new Error('TEST ERROR');
  }

  return {
    props: {
      country: country.data[0] || null,
      countrySlugs,
      slug,
      loc,
      subpagesSlugs: subpagesSlugs.data,
    },
    revalidate: 30,
  };
}
