import MainForm from '/components/mainform/mainForm.js';
import { useIntl } from 'react-intl';
import PopularCountry from '/components/mainpage/popularCountry.js';
import Blog from '/components/mainpage/blog.js';
import { countryData } from '/utils/data/countryData';
import Faq from '/components/mainpage/faq.js';
import { accordionData } from 'utils/data/accordionData';
import SeoBlock from '/components/mainpage/seoBlock.js';
import Head from 'next/head';
import { getLastPost, getPopularCountry } from 'utils/fetch';
import { links } from 'utils/links';
import declension from 'utils/declension';

export default function Home({ postsList, popularCountry }) {
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
        <PopularCountry data={popularCountry} />
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
  const popularCountry = await getPopularCountry(loc);

  if (postsList.errors || popularCountry.errors) {
    // if server down and incorrect request
    console.log('error: ', postsList?.errors);
    console.log('error: ', popularCountry?.errors);
    throw new Error('TEST ERROR');
  }

  const count =
    popularCountry.meta.total_count - popularCountry.meta.filter_count;

  const title = {
    ru: `Еще ${count} ${declension(count, 'страна', 'страны', 'стран')}`,
    uk: `Ще ${count} ${declension(count, 'країна', 'країни', 'країн')}`,
  };

  const last_el = {
    lastCard: true,
    img: '/assets/img/country-all-link.jpg',
    title: title[loc],
  };
  popularCountry.data.push(last_el);

  return {
    props: {
      postsList: postsList.data,
      loc,
      popularCountry: popularCountry.data,
    },
    revalidate: 30,
  };
}
