import MainForm from '/components/mainform/mainForm.js';
import CountryList from '/components/country/countryList.js';
import Blog from '/components/mainpage/blog.js';
import { blogData } from '/utils/data/countryData';
import Faq from '/components/mainpage/faq.js';
import { accordionData } from 'utils/data/accordionData';
import SeoBlock from '/components/mainpage/seoBlock.js';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Anex Country</title>
        <meta name="description" content="Anex Country" />
      </Head>
      <div className="container">
        <MainForm />
        <CountryList />
        <Blog data={blogData} />
        <Faq data={accordionData} />
        <SeoBlock />
      </div>
    </>
  );
}
