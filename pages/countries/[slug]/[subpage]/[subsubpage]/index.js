import { useIntl } from 'react-intl';
import SeoHead from '/components/common/seoHead/seoHead.js';
import { useRouter } from 'next/router';
import {
  getAPICountryListSlugs,
  getCountryFromSlug,
  getCountrySlugsAndSubpagesSlugs,
  getCountrySubpageSlug,
  getCountrySubSubpageSlug,
  getCountrySubpagesSlugs,
} from 'utils/fetch';
import { links } from 'utils/links';
import DefaultErrorPage from 'next/error';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import MainForm from '/components/mainform/mainForm.js';
import H1 from 'components/country/countryPageH1';
import CountryPageContent from 'components/country/countryPageContent';
import { GetLangField } from '/utils/getLangField';

export default function CountrySubSubPage({
  country,
  slug,
  subpage,
  subsubpage,
  loc,
  countrySubpage,
  countrySubSubpage,
  countrySubpages,
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

  const searchSlug = countrySubpages.map(
    (item) => item.subsubpage_slug === subsubpage
  );

  const br_arr = [
    {
      url: links.countries,
      title: intl.formatMessage({ id: 'links.countries' }),
    },
    { url: `${links.countries}/${slug}`, title: country?.translations[0].name },
    {
      url: `${links.countries}/${slug}/${subpage}`,
      title: countrySubpage?.translations[0].name,
    },
    {
      title: countrySubSubpage?.translations[0].name,
    },
  ];

  return (
    <>
      <SeoHead content={countrySubSubpage} />
      {!router.isFallback && !searchSlug.includes(true) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div className="container">
          <Breadcrumbs data={br_arr} beforeMainFrom />
          {countrySubSubpage.translations[0].h1 && (
            <H1>{countrySubSubpage.translations[0].h1}</H1>
          )}
          <MainForm />
          <CountryPageContent
            country={countrySubSubpage}
            loc={loc}
            subpagesSlugs={countrySubpages}
          />
        </div>
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const subsubpageField = true;
  const countrySlugsAndSubpagesSlugs = await getCountrySlugsAndSubpagesSlugs(
    subsubpageField
  );

  const paths = [];
  countrySlugsAndSubpagesSlugs.data.map((item) => {
    return locales.map((locale) => {
      return paths.push({
        params: {
          slug: item.country_slug.slug,
          subpage: item.subpage_slug,
          subsubpage: item.subsubpage_slug,
        },
        locale,
      });
    });
  });
  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const slug = context.params.slug;
  const subpage = context.params.subpage;
  const subsubpage = context.params.subsubpage;
  const loc = context.locale;

  const country = await getCountryFromSlug(slug, loc);
  const countrySubpage = await getCountrySubpageSlug(slug, subpage, loc);
  const countrySubSubpage = await getCountrySubSubpageSlug(slug, subpage, loc);
  const countrySubpages = await getCountrySubpagesSlugs(slug);
  console.log('countrySubpages1', countrySubpage);
  console.log('countrySubpages2', countrySubSubpage);

  if (country.errors || countrySubpage.errors || countrySubpages.errors) {
    // if incorrect request
    console.log('error: ', country?.errors);
    console.log('error: ', countrySubpage?.errors);
    console.log('error: ', countrySubpages?.errors);
    throw new Error('TEST ERROR');
  }

  return {
    props: {
      country: country.data[0] || null,
      slug,
      subpage,
      subsubpage,
      loc,
      countrySubpage: countrySubpage.data[0] || null,
      countrySubSubpage: countrySubSubpage.data[0] || null,
      countrySubpages: countrySubpages.data || null,
    },
    revalidate: 30,
  };
}
