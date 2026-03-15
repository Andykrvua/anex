import MainForm from '/components/mainform/mainForm.js';
import { getAllToursTextPages, getToursTextPage } from 'utils/fetch';
import SeoHead from '/components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { useIntl } from 'react-intl';
import Post from '/components/blog/post.js';
import { location } from 'utils/constants';
import SubpagesLinksBlock from 'components/tours/subpages-links/subpageslinks';
import { links } from 'utils/links';
import { useRouter } from 'next/router';
import DefaultErrorPage from 'next/error';
import CountryToursMonth from 'components/country/countryToursMonth';

export default function ToursSubpage({
  toursTextPage,
  prevToursTextPage,
  subpage,
  subpagesLinks,
  subsubpagesLinks,
  bus,
  rb,
  timeOfYear,
  monthSubpagesLinks,
}) {
  // route example: /tours/charter-bus/albaniya/
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
  const searchSlug = subpagesLinks.map((item) => item.subpage === subpage);

  const br_arr = [
    { url: links.tours, title: intl.formatMessage({ id: 'tour.br' }) },
    { url: `${links.tours}/${prevToursTextPage.slug}`, title: prevToursTextPage?.translations[0].name },
    {
      title:
        bus || rb || timeOfYear
          ? toursTextPage?.translations[0].name
          : intl.formatMessage({ id: 'country.tours_from_short' }) +
            ' ' +
            toursTextPage?.translations[0].name,
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
          <h2 style={style}>{toursTextPage.translations[0]?.h1}</h2>
          <MainForm />
          <Post post={toursTextPage} variant={location.postContent.countryPage} tours />
          {subpagesLinks && bus && (
            <SubpagesLinksBlock
              allLinks={
                bus ? subpagesLinks : subpagesLinks.filter((item) => !item.bus && item.subpage !== subpage)
              }
              level3links={subsubpagesLinks}
              title={prevToursTextPage?.translations[0].name}
              current={subpage}
              level={2}
              bus={bus}
            />
          )}
          {monthSubpagesLinks && monthSubpagesLinks.length > 0 && (
            <CountryToursMonth
              data={monthSubpagesLinks}
              current={subpage}
              title={prevToursTextPage?.translations[0]?.name}
              getSlug={(item) => item.subpage}
              getHref={(item) => `${links.tours}/${item.slug}/${item.subpage}/`}
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
    if (!item.subpage) return;
    return locales.map((locale) => {
      return paths.push({
        params: { slug: item.slug, subpage: item.subpage },
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

  const prevToursTextPageTemp = await getToursTextPage(loc, slug);

  const prevToursTextPage = prevToursTextPageTemp.data.filter((nosubpage) => !nosubpage.subpage);
  const subpagesLinks = prevToursTextPageTemp.data.filter(
    (nosubpage) => nosubpage.subpage && !nosubpage.subsubpage,
  );
  const subsubpagesLinks = prevToursTextPageTemp.data.filter(
    (nosubpage) => nosubpage.subsubpage && nosubpage.subpage === subpage,
  );

  const toursTextPage = await getToursTextPage(loc, slug, subpage);
  const allLinks = await getAllToursTextPages(loc);
  const monthSubpagesLinks = subpagesLinks.filter((item) => item.time_of_year);

  const bus = !!toursTextPage.data.filter((item) => item.bus).length;
  const rb = !!toursTextPage.data.filter((item) => item.rb).length;
  const timeOfYear = !!toursTextPage.data.filter((item) => item.time_of_year).length;

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
      toursTextPage: toursTextPage.data.filter((item) => !item.subsubpage)[0] || null,
      prevToursTextPage: prevToursTextPage[0] || null,
      allLinks: allLinks.data.filter((nosubpage) => !nosubpage.subpage),
      subpage,
      subpagesLinks,
      subsubpagesLinks,
      bus,
      rb,
      timeOfYear,
      monthSubpagesLinks: monthSubpagesLinks.length ? monthSubpagesLinks : null,
    },
    revalidate: 30,
  };
}
