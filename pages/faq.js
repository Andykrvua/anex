import styles from 'components/faq/faq.module.css';
import { getPageSettings } from 'utils/fetch';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { useIntl } from 'react-intl';
import Accordion from 'components/common/accordion/accordion';

export default function FaqPage({ pageSettings }) {
  const intl = useIntl();
  const br_arr = [{ title: intl.formatMessage({ id: 'faqpage.br' }) }];

  return (
    <>
      <SeoHead content={pageSettings} />
      <div className="container">
        <Breadcrumbs data={br_arr} beforeMainFrom />
        <h1 className={styles.title}>{pageSettings.translations[0]?.h1}</h1>
        {pageSettings.translations[0].faq_item && <Accordion data={pageSettings.translations[0].faq_item} />}
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;

  const data = 'translations.h1,translations.faq_item';
  const pageSettings = await getPageSettings('faq_page', loc, data);

  if (pageSettings.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', pageSettings?.errors);
    throw new Error('ERROR FAQ');
  }

  return {
    props: {
      loc,
      pageSettings: pageSettings.data,
    },
    revalidate: 30,
  };
}
