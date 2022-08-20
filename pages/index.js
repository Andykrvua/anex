import MainForm from '/components/mainform/mainForm.js';
import PopularCountry from '/components/mainpage/popularCountry.js';
import Blog from '/components/mainpage/blog.js';
import Faq from '/components/mainpage/faq.js';
import { accordionData } from 'utils/data/accordionData';
import SeoBlock from '/components/common/pageSeoBlock/seoBlock.js';
import { getLastPost, getPopularCountry, getPageSettings } from 'utils/fetch';
import declension from 'utils/declension';
import SeoHead from '/components/common/seoHead/seoHead.js';
import { useGetTest, useSetTest } from '/store/store';

export default function Home({ postsList, popularCountry, mainPageSettings }) {
  // const get = useGetTest();
  // console.log(get);
  const set = useSetTest();
  set('gggg2');
  // const get = useGetTest();
  // console.log(get);
  return (
    <>
      <SeoHead content={mainPageSettings} />
      <div className="container">
        <MainForm />
        <PopularCountry data={popularCountry} />
        <Blog data={postsList} />
        <Faq data={accordionData} />
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
  const data = 'translations.seo_block';
  const mainPageSettings = await getPageSettings('main_page', loc, data);

  if (postsList.errors || popularCountry.errors || mainPageSettings.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', postsList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', popularCountry?.errors);
    /* eslint-disable-next-line */
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
