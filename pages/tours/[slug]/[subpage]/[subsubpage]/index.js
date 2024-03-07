import MainForm from '/components/mainform/mainForm.js';
import { getAllToursTextPages, getToursTextPage } from 'utils/fetch';
import SeoHead from '/components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { useIntl } from 'react-intl';
import Post from '/components/blog/post.js';
import { location } from 'utils/constants';
import LinksBlock from 'components/tours/tours-text/links';
import SubpagesLinksBlock from 'components/tours/subpages-links/subpageslinks';
import { links } from 'utils/links';
import { useRouter } from 'next/router';
import DefaultErrorPage from 'next/error';
import DistrictList from 'components/country/districtList';

export default function ToursSubsubpage({
  toursTextPage,
  prevPrevToursTextPage,
  prevToursTextPage,
  allLinks,
  slug,
  subpage,
  subsubpage,
  subpagesLinks,
  subsubpagesLinks,
  loc,
  bus,
}) {
  const intl = useIntl();
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div className="container">
        <div>loading...</div>
      </div>
    );
  }

  // all false if country slug not found
  const searchSlug = subpagesLinks.map((item) => item.subsubpage === subsubpage);

  const br_arr = [
    { url: links.tours, title: intl.formatMessage({ id: 'tour.br' }) },
    {
      url: `${links.tours}/${prevPrevToursTextPage.slug}`,
      title: prevPrevToursTextPage?.translations[0].name,
    },
    {
      url: `${links.tours}/${prevPrevToursTextPage.slug}/${prevToursTextPage.subpage}`,
      title: `${prevToursTextPage?.translations[0].name}`,
    },
    {
      title:
        intl.formatMessage({ id: 'country.tours_from_short' }) + ' ' + toursTextPage?.translations[0].name,
    },
  ];

  const style = {
    margin: 'var(--h1margin) 0',
    fontSize: '20px',
    lineHeight: '23px',
    fontWeight: 700,
  };

  return (
    <>
      <SeoHead content={toursTextPage} />
      {!router.isFallback && !searchSlug.includes(true) ? (
        <DefaultErrorPage statusCode={404} />
      ) : (
        <div className="container">
          <Breadcrumbs data={br_arr} beforeMainFrom />
          <h2 style={style}>{toursTextPage.translations[0].h1}</h2>
          <MainForm />
          {/* {bus && (
            <DistrictList
              data={subsubpagesLinks.filter((item) => item.subsubpage !== router.query.subsubpage)}
              title={
                intl.formatMessage({ id: 'country.from_1' }) +
                ' ' +
                prevToursTextPage?.translations[0].name +
                ' ' +
                intl.formatMessage({ id: 'country.from_2' })
              }
              country={''}
              loc={loc}
              variant={location.districtList.busToursPage}
            />
          )} */}
          <Post post={toursTextPage} variant={location.postContent.countryPage} tours />
          {/* <LinksBlock allLinks={allLinks} /> */}
          {subpagesLinks && subpagesLinks.length && (
            <SubpagesLinksBlock
              allLinks={subpagesLinks}
              level3links={subsubpagesLinks.filter(
                (item) => item.subsubpage !== router.query.subsubpage && item.subpage === router.query.subpage
              )}
              title={prevToursTextPage?.translations[0].h1}
              current={subpage}
              level={3}
              bus={bus}
            />
          )}
        </div>
      )}
    </>
  );
}

export async function getStaticPaths({ locales }) {
  const allLinks = await getAllToursTextPages();

  const paths = [];
  allLinks.data.map((item) => {
    if (!item.subpage || !item.subsubpage) return;
    return locales.map((locale) => {
      return paths.push({
        params: { slug: item.slug, subpage: item.subpage, subsubpage: item.subsubpage },
        locale,
      });
    });
  });

  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const loc = context.locale;
  const slug = context.params.slug;
  const subpage = context.params.subpage;
  const subsubpage = context.params.subsubpage;

  const prevToursTextPageTemp = await getToursTextPage(loc, slug);

  const prevPrevToursTextPage = prevToursTextPageTemp.data.filter((nosubpage) => !nosubpage.subpage);
  const prevToursTextPage = prevToursTextPageTemp.data.filter(
    (nosubpage) => nosubpage.subpage === subpage && !nosubpage.subsubpage
  );

  const subpagesLinks = prevToursTextPageTemp.data.filter((nosubpage) => nosubpage.subpage);
  const subsubpagesLinks = prevToursTextPageTemp.data.filter((nosubpage) => nosubpage.subsubpage);

  const toursTextPage = await getToursTextPage(loc, slug, subpage, subsubpage);
  const allLinks = await getAllToursTextPages(loc);

  const bus = !!toursTextPage.data.filter((item) => item.bus).length;

  // const subpagesLinks = toursTextPageTemp.data.filter((nosubpage) => nosubpage.subpage);
  // const toursTextPage = toursTextPageTemp.data.filter((nosubpage) => !nosubpage.subpage);

  if (allLinks.errors || toursTextPage.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', allLinks?.errors);
    /* eslint-disable-next-line */
    console.log('error: ', toursTextPage?.errors);
    throw new Error('ERROR TOURS SLUG');
  }

  return {
    props: {
      toursTextPage: toursTextPage.data[0] || null,
      prevPrevToursTextPage: prevPrevToursTextPage[0] || null,
      prevToursTextPage: prevToursTextPage[0] || null,
      allLinks: allLinks.data.filter((nosubpage) => !nosubpage.subpage),
      slug,
      subpage,
      subsubpage,
      subpagesLinks,
      subsubpagesLinks,
      loc,
      bus,
    },
    revalidate: 30,
  };
}
