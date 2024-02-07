import MainForm from '/components/mainform/mainForm.js';
import { getPageSettings, getAllToursTextPages } from 'utils/fetch';
import SeoHead from '/components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { useIntl } from 'react-intl';
import Post from '/components/blog/post.js';
import { location } from 'utils/constants';
import LinksBlock from 'components/tours/tours-text/links';
import DistrictList from 'components/country/districtList';

export default function Tour({ pageSettings, allLinks, loc }) {
  const intl = useIntl();
  const br_arr = [{ title: intl.formatMessage({ id: 'tour.br' }) }];

  return (
    <>
      <SeoHead content={pageSettings} />
      <div className="container">
        <Breadcrumbs data={br_arr} beforeMainFrom />
        <MainForm />
        {/* <LinksBlock allLinks={allLinks} /> */}
        <DistrictList
          data={allLinks}
          title={pageSettings.translations[0].post_title}
          country={''}
          loc={loc}
          variant={location.districtList.allToursPage}
        />
        <Post variant={location.postContent.tourPage} post={pageSettings} />
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;

  const data = 'translations.content';
  const pageSettings = await getPageSettings('alltours_tex_page', loc, data);
  const allLinks = await getAllToursTextPages(loc);

  if (allLinks.errors || pageSettings.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', allLinks?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', pageSettings?.errors);
    throw new Error('ERROR TOURS');
  }

  return {
    props: {
      pageSettings: pageSettings.data,
      allLinks: allLinks.data.filter((nosubpage) => !nosubpage.subpage),
      loc,
    },
    revalidate: 30,
  };
}
