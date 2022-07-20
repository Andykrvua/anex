import MainForm from '/components/mainform/mainForm.js';
import CountryList from '/components/country/countryList.js';
import Faq from '/components/mainpage/faq.js';
import { accordionData } from 'utils/data/accordionData';
import SeoBlock from '/components/mainpage/seoBlock.js';
import Head from 'next/head';
import { getAPICountryList } from 'utils/fetch';

export default function Countries({ countryList, loc }) {
  return (
    <>
      <Head>
        <title>Anex Country</title>
        <meta name="description" content="Anex Country" />
      </Head>
      <div className="container">
        <MainForm />
        <CountryList countryList={countryList} loc={loc} />
        <Faq data={accordionData} />
        <SeoBlock />
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;

  const countryList = await getAPICountryList();

  if (countryList.errors) {
    // if server down and incorrect request
    console.log('error: ', countryList?.errors);
    throw new Error('TEST ERROR');
    // return {
    //   notFound: true,
    // };
  }

  return {
    props: { countryList, loc },
    revalidate: 30,
  };
}
