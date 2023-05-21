const {
  getPostsList,
  getCountries,
  getPostsFromCountry,
} = require('utils/fetch');
const { server } = require('utils/utils');
const Promise = require('promise');

export default async function getBlogSitemap() {
  const posts = await getPostsList(1);
  const blogPaths = posts?.data?.map(({ slug, date_created }) => ({
    url: `${server}/blog/${slug}/`,
    date: new Date(date_created).toISOString(),
  }));
  const blogPathsUk = posts?.data?.map(({ slug, date_created }) => ({
    url: `${server}/uk/blog/${slug}/`,
    date: new Date(date_created).toISOString(),
  }));

  const blogCountriesData = await getCountries();
  let blogCountriesPaths = [];
  let blogCountriesPathsUk = [];
  let blogCountriesSubData = [];
  const blogCountriesSubPaths = [];
  const blogCountriesSubPathsUk = [];

  if (blogCountriesData.data) {
    blogCountriesPaths = blogCountriesData.data.map(({ slug }) => ({
      url: `${server}/blog/${slug}/`,
      data: null,
    }));
    blogCountriesPathsUk = blogCountriesData.data.map(({ slug }) => ({
      url: `${server}/uk/blog/${slug}/`,
      data: null,
    }));
    await Promise.all(
      blogCountriesData.data.map(({ slug }) =>
        getPostsFromCountry(slug, 1).then(
          (resp) =>
            (blogCountriesSubData = [...blogCountriesSubData, ...resp.data])
        )
      )
    );
  }

  blogCountriesSubData.forEach(({ slug }) => {
    const url = `${server}/blog/${slug}/`;
    if (!blogCountriesSubPaths.find((e) => e.url === url)) {
      blogCountriesSubPaths.push({ url, data: null });
    }
  });

  blogCountriesSubData.forEach(({ slug }) => {
    const url = `${server}/uk/blog/${slug}/`;
    if (!blogCountriesSubPathsUk.find((e) => e.url === url)) {
      blogCountriesSubPathsUk.push({ url, data: null });
    }
  });

  return {
    blogPaths,
    blogPathsUk,
    blogCountriesPaths,
    blogCountriesPathsUk,
    blogCountriesSubPaths,
    blogCountriesSubPathsUk,
  };
}
