import { server } from 'utils/utils';
import {
  getAPICountryList,
  getCountrySubSubpageSlug,
  getCountrySubpagesSlugs,
} from 'utils/fetch';

const Promise = require('promise');

export default async function getCountriesSiteMap() {
  const countries = await getAPICountryList();

  const countriesPaths = countries?.data
    ? countries?.data?.map(({ slug }) => ({
        url: `${server}/countries/${slug}/`,
        date: null,
      }))
    : [];
  const countriesPathsUk = countries?.data
    ? countries?.data?.map(({ slug }) => ({
        url: `${server}/uk/countries/${slug}/`,
        date: null,
      }))
    : [];

  let countriesSubPagesData = [];

  if (countries?.data) {
    await Promise.all(
      countries?.data.map(({ slug }) =>
        getCountrySubpagesSlugs(slug).then(
          (resp) =>
            (countriesSubPagesData = [...countriesSubPagesData, ...resp.data])
        )
      )
    );
  }

  const countriesSubPagesPaths = [];

  countriesSubPagesData.forEach(({ country_slug: { slug }, subpage_slug }) => {
    const url = `${server}/countries/${slug}/${subpage_slug}/`;
    if (!countriesSubPagesPaths.find((e) => e.url === url)) {
      countriesSubPagesPaths.push({ url, date: null });
    }
  });

  const countriesSubPagesPathsUk = [];

  countriesSubPagesData.forEach(({ country_slug: { slug }, subpage_slug }) => {
    const url = `${server}/uk/countries/${slug}/${subpage_slug}/`;
    if (!countriesSubPagesPathsUk.find((e) => e.url === url)) {
      countriesSubPagesPathsUk.push({ url, date: null });
    }
  });

  let countriesSubPagesSubPagesData = [];

  await Promise.all(
    countriesSubPagesData.map(
      ({ country_slug: { slug = '' }, subpage_slug, subsubpage_slug }) =>
        subsubpage_slug
          ? getCountrySubSubpageSlug(
              slug,
              subpage_slug,
              subsubpage_slug,
              'uk'
            ).then((resp) => {
              countriesSubPagesSubPagesData = [
                ...countriesSubPagesSubPagesData,
                ...resp.data,
              ];
            })
          : null
    )
  );

  const countriesSubPagesSubPagesPaths = [];

  countriesSubPagesSubPagesData.map(
    ({ country_slug: { slug }, subpage_slug, subsubpage_slug }) => {
      const url = `${server}/countries/${slug}/${subpage_slug}/${subsubpage_slug}/`;
      if (!countriesSubPagesSubPagesPaths.find((e) => e.url === url)) {
        countriesSubPagesSubPagesPaths.push({ url, date: null });
      }
    }
  );

  const countriesSubPagesSubPagesPathsUk = [];

  countriesSubPagesSubPagesData.map(
    ({ country_slug: { slug }, subpage_slug, subsubpage_slug }) => {
      const url = `${server}/uk/countries/${slug}/${subpage_slug}/${subsubpage_slug}/`;
      if (!countriesSubPagesSubPagesPathsUk.find((e) => e.url === url)) {
        countriesSubPagesSubPagesPathsUk.push({ url, date: null });
      }
    }
  );

  return {
    countriesPaths,
    countriesPathsUk,
    countriesSubPagesPaths,
    countriesSubPagesPathsUk,
    countriesSubPagesSubPagesPaths,
    countriesSubPagesSubPagesPathsUk,
  };
}
