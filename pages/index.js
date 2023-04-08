import MainForm from '/components/mainform/mainForm.js';
import PopularCountry from '/components/mainpage/popularCountry.js';
import Blog from '/components/mainpage/blog.js';
import Faq from '/components/mainpage/faq.js';
import SeoBlock from '/components/common/pageSeoBlock/seoBlock.js';
import {
  getLastPost,
  getPopularCountry,
  getPageSettings,
  getMinOffer,
} from 'utils/fetch';
import { countryUpdateMinOffer } from 'utils/nextFetch';
import declension from 'utils/declension';
import SeoHead from '/components/common/seoHead/seoHead.js';
import { useEffect } from 'react';

export default function Home({
  postsList,
  popularCountry,
  mainPageSettings,
  faqData,
  faqDataLength,
  minOffer,
}) {
  useEffect(async () => {
    const result = await countryUpdateMinOffer();
    // console.log('minOffer update', result);
  }, []);

  return (
    <>
      <SeoHead content={mainPageSettings} />
      <div className="container">
        <MainForm />
        {/* <PopularCountry
          data={popularCountry}
          minOffer={minOffer?.data?.countries}
        /> */}
        <Blog data={postsList} />
        {faqData && <Faq data={faqData} length={faqDataLength} />}
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

  const dataOtherPage = 'translations.h1,translations.faq_item';
  const faqPageSettings = await getPageSettings('faq_page', loc, dataOtherPage);

  const minOffer = await getMinOffer();

  if (
    postsList.errors ||
    popularCountry.errors ||
    mainPageSettings.errors ||
    faqPageSettings.errors ||
    minOffer.errors
  ) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', postsList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', popularCountry?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', mainPageSettings?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', faqPageSettings?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', minOffer?.errors);
    throw new Error('TEST ERROR');
  }

  let faqData = [];
  let faqDataLength;
  if (faqPageSettings?.data?.translations[0]?.faq_item.length > 0) {
    faqDataLength = faqPageSettings?.data?.translations[0]?.faq_item.length;
    faqData = faqPageSettings.data.translations[0].faq_item.filter(
      (item) => item?.ismain
    );
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
      faqData: faqData.length > 0 ? faqData : null,
      faqDataLength: faqDataLength || null,
      minOffer: minOffer.data || null,
    },
    revalidate: 30,
  };
}
