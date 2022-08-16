import MainForm from '/components/mainform/mainForm.js';
import CountryList from '/components/country/countryList.js';
import Faq from '/components/mainpage/faq.js';
import { accordionData } from 'utils/data/accordionData';
import SeoBlock from '/components/common/pageSeoBlock/seoBlock.js';
import { getAPICountryList, getPageSettings } from 'utils/fetch';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { useIntl } from 'react-intl';
import SeoHead from '/components/common/seoHead/seoHead.js';

export default function Countries({
  countryList,
  loc,
  allCountriesPageSettings,
}) {
  const intl = useIntl();
  if (allCountriesPageSettings.status === 'draft') {
    console.log('Page settings not set');
  }

  const br_arr = [{ title: intl.formatMessage({ id: 'links.countries' }) }];
  return (
    <>
      <SeoHead content={allCountriesPageSettings} />
      <div className="container">
        <Breadcrumbs data={br_arr} beforeMainFrom />
        <MainForm />
        <CountryList countryList={countryList} loc={loc} />
        <Faq data={accordionData} />
        {allCountriesPageSettings.translations && (
          <SeoBlock text={allCountriesPageSettings.translations[0].seo_block} />
        )}
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;

  const countryList = await getAPICountryList();

  const data = 'translations.seo_block';
  const allCountriesPageSettings = await getPageSettings(
    'all_countries_page',
    loc,
    data
  );

  if (countryList.errors || allCountriesPageSettings.errors) {
    // if incorrect request
    console.log('error: ', countryList?.errors);
    console.log('error: ', allCountriesPageSettings?.errors);
    throw new Error('TEST ERROR');
  }

  return {
    props: {
      countryList,
      loc,
      allCountriesPageSettings: allCountriesPageSettings.data,
    },
    revalidate: 30,
  };
}
