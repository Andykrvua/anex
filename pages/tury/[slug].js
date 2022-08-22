import MainForm from '/components/mainform/mainForm.js';
import { getPageSettings, getAllToursTextPages } from 'utils/fetch';
import SeoHead from '/components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { useIntl } from 'react-intl';
import Post from '/components/blog/post.js';
import { location } from 'utils/constants';
import LinksBlock from 'components/tours/tours-text/links';

export default function Tours({ pageSettings, allLinks }) {
  // console.log(allLinks);
  const intl = useIntl();
  const br_arr = [{ title: intl.formatMessage({ id: 'tour.br' }) }];
  return (
    <>
      <SeoHead content={pageSettings} />
      <div className="container">
        <Breadcrumbs data={br_arr} beforeMainFrom />
        <MainForm />
        <LinksBlock allLinks={allLinks} />
        <Post variant={location.postContent.tourPage} post={pageSettings} />
      </div>
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const allLinks = await getAllToursTextPages();

  const paths = [];
  allLinks.data.map((item) => {
    return locales.map((locale) => {
      return paths.push({
        params: { slug: item.slug },
        locale,
      });
    });
  });
  // console.log(paths);
  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const loc = context.locale;
  const slug = context.params.slug;

  const data = 'translations.content';
  const pageSettings = await getPageSettings('alltours_tex_page', loc, data);
  const allLinks = await getAllToursTextPages(loc);
  if (allLinks.errors || pageSettings.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', allLinks?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', pageSettings?.errors);
    throw new Error('TEST ERROR');
  }

  return {
    props: {
      pageSettings: pageSettings.data,
      allLinks: allLinks.data,
    },
    revalidate: 30,
  };
}
