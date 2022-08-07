import { useIntl } from 'react-intl';
import SeoHead from '/components/common/seoHead/seoHead.js';
import { useRouter } from 'next/router';
import {
  getAPICountryListSlugs,
  getCountryFromSlug,
  getCountrySlugsAndSubpagesSlugs,
} from 'utils/fetch';
import { links } from 'utils/links';
import DefaultErrorPage from 'next/error';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import MainForm from '/components/mainform/mainForm.js';
import H1 from 'components/country/countryPageH1';
import CountryPageContent from 'components/country/countryPageContent';

export default function Country({ country, countrySlugs, slug, loc }) {
  const intl = useIntl();
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container">
        <div>loading...</div>
      </div>
    );
  }

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
          {/* <CountryPageContent country={country} loc={loc} /> */}
        </div>
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const countrySlugsAndSubpagesSlugs = await getCountrySlugsAndSubpagesSlugs();

  // const countrySlugs = await getAPICountryListSlugs();

  // получить все слаги стран у которых есть сабпейдж, сгруппировать все слаги сабпейдж в один масиив для каждого слага страны и положить в объект
  // потом пройтись по всем слагам стран и положить в объект ключ слага и масиив слагов сабпейдж

  const paths = [];
  countrySlugsAndSubpagesSlugs.data.map((item) => {
    return locales.map((locale) => {
      return paths.push({
        params: { slug: item.country_slug.slug, subpage: item.subpage_slug },
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

  if (country.errors || countrySlugs.errors) {
    // if incorrect request
    console.log('error: ', country?.errors);
    console.log('error: ', countrySlugs?.errors);
    throw new Error('TEST ERROR');
  }

  return {
    props: {
      country: country.data[0] || null,
      countrySlugs,
      slug,
      loc,
    },
    revalidate: 30,
  };
}
