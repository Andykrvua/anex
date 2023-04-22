import { useIntl } from 'react-intl';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import BlogContent from 'components/blog/blog';
import {
  getPostsList,
  getCategories,
  getCountries,
  getPageSettings,
} from 'utils/fetch';
import SeoHead from 'components/common/seoHead/seoHead.js';

export default function Blog({
  postsList,
  categoryList,
  loc,
  countryList,
  pageSettings,
}) {
  console.log('pageSettings', pageSettings);
  const intl = useIntl();

  const br_arr = [{ title: intl.formatMessage({ id: 'links.blog' }) }];

  const pagesCount = Math.ceil(
    postsList?.meta.filter_count / blogApi.announceLimit
  );

  const current = 1;

  return (
    <>
      <SeoHead content={pageSettings} />
      <BlogContent
        br_arr={br_arr}
        categoryListItems={categoryList}
        countryListItems={countryList}
        postsList={postsList}
        loc={loc}
        curr={current}
        pagesCount={pagesCount}
        firstPageUrl={links.blog}
      />
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;
  const page = 1;
  const postsList = await getPostsList(page);
  const resCategoryList = await getCategories();
  const resCountryList = await getCountries();

  const data = 'translations.description,translations.title';
  const pageSettings = await getPageSettings('blog_page', loc, data);

  if (
    postsList.errors ||
    resCategoryList.errors ||
    resCountryList.errors ||
    pageSettings.errors
  ) {
    // if server down and incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', postsList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', resCategoryList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', resCountryList?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', pageSettings?.errors);
    throw new Error('TEST ERROR');
  }

  const categoryList = resCategoryList.data;
  const countryList = resCountryList.data;

  return {
    props: {
      postsList,
      categoryList,
      loc,
      countryList,
      pageSettings: pageSettings.data,
    },
    revalidate: 30,
  };
}
