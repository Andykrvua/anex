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

export default function Tours({ toursTextPage, allLinks, slug, loc, subpagesLinks, bus }) {
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
  const searchSlug = allLinks.map((item) => item.slug === slug);

  const br_arr = [
    { url: links.tours, title: intl.formatMessage({ id: 'tour.br' }) },
    { title: toursTextPage?.translations[0].name },
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
          {bus && (
            <DistrictList
              data={subpagesLinks}
              title={intl.formatMessage({ id: 'country.tours_pop' })}
              country={''}
              loc={loc}
              variant={location.districtList.busToursPage}
            />
          )}
          <Post post={toursTextPage} variant={location.postContent.countryPage} />
          {/* <LinksBlock allLinks={allLinks} /> */}
          {subpagesLinks && subpagesLinks.length && !bus && (
            <SubpagesLinksBlock
              allLinks={subpagesLinks}
              title={toursTextPage?.translations[0].name}
              current={slug}
              level={1}
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
  allLinks.data
    .filter((nosubpage) => !nosubpage.subpage)
    .map((item) => {
      return locales.map((locale) => {
        return paths.push({
          params: { slug: item.slug },
          locale,
        });
      });
    });

  return { paths, fallback: true };
}

export async function getStaticProps(context) {
  const loc = context.locale;
  const slug = context.params.slug;

  const toursTextPageTemp = await getToursTextPage(loc, slug);
  const subpagesLinks = toursTextPageTemp.data.filter(
    (nosubpage) => nosubpage.subpage && !nosubpage.subsubpage
  );

  const toursTextPage = toursTextPageTemp.data.filter((nosubpage) => !nosubpage.subpage);
  const bus = !!subpagesLinks.filter((item) => item.bus).length;

  const allLinks = await getAllToursTextPages(loc);
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
      toursTextPage: toursTextPage[0] || null,
      allLinks: allLinks.data.filter((nosubpage) => !nosubpage.subpage),
      slug,
      loc,
      subpagesLinks: subpagesLinks.length ? subpagesLinks : null,
      bus,
    },
    revalidate: 30,
  };
}
