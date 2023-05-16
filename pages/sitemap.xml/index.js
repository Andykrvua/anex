import getStaticPaths from './staticPaths';
import getBlogSitemap from './blog';
import getCountriesSiteMap from './countries';
import getToursSiteMap from './tours';
import { server } from 'utils/utils';

const Sitemap = () => {
  return null;
};

export const getServerSideProps = async ({ res }) => {
  const {
    blogPaths,
    blogPathsUk,
    blogCountriesPaths,
    blogCountriesPathsUk,
    blogCountriesSubPaths,
    blogCountriesSubPathsUk,
  } = await getBlogSitemap();
  const {
    countriesPaths,
    countriesPathsUk,
    countriesSubPagesPaths,
    countriesSubPagesPathsUk,
    countriesSubPagesSubPagesPaths,
    countriesSubPagesSubPagesPathsUk,
  } = await getCountriesSiteMap();

  const { toursPaths, toursPathUk } = await getToursSiteMap();
  const { staticPaths, staticPathsUk } = getStaticPaths();

  const paths = [
    { url: server, date: null },
    { url: `${server}/uk/`, date: null },
    ...staticPaths,
    ...staticPathsUk,
    // ...blogPaths,
    // ...blogPathsUk,
    // ...blogCountriesPaths,
    // ...blogCountriesPathsUk,
    ...blogCountriesSubPaths,
    ...blogCountriesSubPathsUk,
    ...countriesPaths,
    ...countriesPathsUk,
    ...countriesSubPagesPaths,
    ...countriesSubPagesPathsUk,
    ...countriesSubPagesSubPagesPaths,
    ...countriesSubPagesSubPagesPathsUk,
    ...toursPaths,
    ...toursPathUk,
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset   xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${paths
        .map(({ url, date }) => {
          return `
            <url >
              <loc>${url}</loc>
              <lastmod>${date ?? new Date().toISOString()}</lastmod>
            </url>
          `;
        })
        .join('')}
    </urlset>
`;
  res.setHeader('Content-Type', 'text/json');
  res.write(sitemap);
  res.end();

  return {
    props: {
      data: {
        ru: {
          pages: staticPaths,
          blog: blogPaths,
          blogCountries: blogCountriesPaths,
          blogCountriesSub: blogCountriesSubPaths,
          countries: countriesPaths,
          countriesSubPages: countriesSubPagesPaths,
          countriesSubPagesSubPages: countriesSubPagesSubPagesPaths,
        },
        uk: {
          pages: staticPathsUk,
          blog: blogPathsUk,
          blogCountries: blogCountriesPathsUk,
          blogCountriesSub: blogCountriesSubPathsUk,
          countries: countriesPathsUk,
          countriesSubPages: countriesSubPagesPathsUk,
          countriesSubPagesSubPages: countriesSubPagesSubPagesPathsUk,
        },
      },
    },
  };
};

export default Sitemap;
