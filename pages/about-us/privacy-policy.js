import { useIntl } from 'react-intl';
import { getPostsList, getCategories, getCountries } from 'utils/fetch';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Content from 'components/privacypolicy/content';
import { getPageSettings, getAllToursTextPages } from 'utils/fetch';

export default function PrivacyPolicy({ pageSettings }) {
  const intl = useIntl();

  const br_arr = [{ title: intl.formatMessage({ id: 'nav.privacy_policy' }) }];

  return (
    <>
      <SeoHead content={pageSettings} />
      <div className="container">
        <Breadcrumbs data={br_arr} />
        <Content pageSettings={pageSettings} />
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;

  const data = 'translations.content';
  const pageSettings = await getPageSettings('privacypolicy_page', loc, data);
  if (pageSettings.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', pageSettings?.errors);
    throw new Error('ERROR POLICY');
  }

  return {
    props: {
      pageSettings: pageSettings.data,
    },
    revalidate: 30,
  };
}
