import MainForm from '/components/mainform/mainForm.js';
import PopularCountry from '/components/mainpage/popularCountry.js';
import Blog from '/components/mainpage/blog.js';
import Faq from '/components/mainpage/faq.js';
import { accordionData } from 'utils/data/accordionData';
import SeoBlock from '/components/common/pageSeoBlock/seoBlock.js';
import { getLastPost, getPopularCountry, getPageSettings } from 'utils/fetch';
import declension from 'utils/declension';
import SeoHead from '/components/common/seoHead/seoHead.js';

export default function Home({ postsList, popularCountry, mainPageSettings }) {
  return (
    <>
      <SeoHead content={mainPageSettings} />
      <div className="container">
        <MainForm />
        <PopularCountry data={popularCountry} />
        <Blog data={postsList} />
        <Faq data={accordionData} />
        <SeoBlock />
        {mainPageSettings.translations && (
          <SeoBlock text={mainPageSettings.translations[0].seo_block} />
        )}
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;

  const limit = 6;
  const postsList = await getLastPost(limit, loc);
  const popularCountry = await getPopularCountry(loc);
  const mainPageSettings = await getPageSettings('main_page', loc);

  if (postsList.errors || popularCountry.errors || mainPageSettings.errors) {
    // if incorrect request
    console.log('error: ', postsList?.errors);
    console.log('error: ', popularCountry?.errors);
    console.log('error: ', mainPageSettings?.errors);
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
      mainPageSettings: mainPageSettings.data,
    },
    revalidate: 30,
  };
}
