import MainForm from '/components/mainform/mainForm.js';
import CountryList from '/components/country/countryList.js';
import Faq from '/components/mainpage/faq.js';
import SeoBlock from '/components/common/pageSeoBlock/seoBlock.js';
import { getAPICountryList, getPageSettings } from 'utils/fetch';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { useIntl } from 'react-intl';
import SeoHead from '/components/common/seoHead/seoHead.js';

export default function Countries({ countryList, loc, allCountriesPageSettings, faqData, faqDataLength }) {
  const intl = useIntl();
  if (allCountriesPageSettings.status === 'draft') {
    /* eslint-disable-next-line */
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
        {/* {faqData && <Faq data={faqData} length={faqDataLength} />} */}
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
  const allCountriesPageSettings = await getPageSettings('all_countries_page', loc, data);

  const dataOtherPage = 'translations.h1,translations.faq_item';
  const faqPageSettings = await getPageSettings('faq_page', loc, dataOtherPage);

  if (countryList.errors || allCountriesPageSettings.errors || faqPageSettings.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', countryList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', allCountriesPageSettings?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', faqPageSettings?.errors);
    throw new Error('ERROR COUNTRY');
  }

  let faqData = [];
  let faqDataLength;
  if (faqPageSettings?.data?.translations[0]?.faq_item.length > 0) {
    faqDataLength = faqPageSettings?.data?.translations[0]?.faq_item.length;
    faqData = faqPageSettings.data.translations[0].faq_item.filter((item) => item?.ismain);
  }

  return {
    props: {
      countryList,
      loc,
      allCountriesPageSettings: allCountriesPageSettings.data,
      faqData: faqData.length > 0 ? faqData : null,
      faqDataLength: faqDataLength || null,
    },
    revalidate: 30,
  };
}
