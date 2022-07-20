import MainForm from '/components/mainform/mainForm.js';
import { useIntl } from 'react-intl';
import PopularCountry from '/components/mainpage/popularCountry.js';
import Blog from '/components/mainpage/blog.js';
import { countryData, blogData } from '/utils/data/countryData';
import Faq from '/components/mainpage/faq.js';
import { accordionData } from 'utils/data/accordionData';
import SeoBlock from '/components/mainpage/seoBlock.js';
import Head from 'next/head';
import { getLastPost } from 'utils/fetch';

export default function Home({ postsList }) {
  const intl = useIntl();

  //нужно для передачи в HEAD
  const title = intl.formatMessage({ id: 'nav.tour' });
  const description = intl.formatMessage({
    id: 'nav.country',
  });

  return (
    <>
      <Head>
        <title>Anex Main</title>
        <meta name="description" content="Anex Main" />
      </Head>
      <div className="container">
        <MainForm />
        <PopularCountry data={countryData} />
        <Blog data={postsList} />
        <Faq data={accordionData} />
        <SeoBlock />
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;

  const limit = 6;
  const postsList = await getLastPost(limit, loc);

  if (postsList.errors) {
    // if server down and incorrect request
    console.log('error: ', postsList?.errors);
    throw new Error('TEST ERROR');
  }

  return {
    props: {
      postsList: postsList.data,
      loc,
    },
    revalidate: 30,
  };
}
