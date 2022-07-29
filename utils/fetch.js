import { blogApi } from './constants';
import { languagesApi } from './constants';

const req = async (url) => {
  const response = await fetch(`${process.env.API}${url}`)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Bad response');
    })
    .catch((errors) => {
      return { errors };
    });
  return response;
};

export const getPostsList = async (current = 1) => {
  const offset = (current - 1) * blogApi.announceLimit;
  const url = `posts?fields=status,img,date_created,slug,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code&filter[status]=published&deep[categories][_filter][categories_id][status][_eq]=published&meta=*&limit=${blogApi.announceLimit}&offset=${offset}&sort=sort,-date_created`;
  return req(url);
};

export const getLastPost = async (limit = 3, loc, slug) => {
  const locale = languagesApi[loc];
  const url = `posts?fields=status,img,date_created,slug,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code&filter[status]=published&deep[categories][_filter][categories_id][status][_eq]=published&deep[categories][categories_id][translations][_filter][languages_id][_eq]=${locale}&deep[translations][_filter][languages_code][_eq]=${locale}&limit=${limit}&sort=sort,-date_created&filter[slug][_neq]=${slug}`;
  return req(url);
};

export const getPostsMeta = async () => {
  const url = `posts?meta=*&limit=0&filter[status]=published`;
  const postsMeta = await req(url);
  return postsMeta.meta.filter_count;
};

export const getCategories = async () => {
  const url = `categories?fields=status,slug,bg_color,translations.languages_id,translations.name&filter[status]=published`;
  return req(url);
};

export const getCategoriesSlug = async () => {
  const url = `categories?fields=slug,status,posts.posts_id&filter[status]=published&deep[posts][_filter][posts_id][_neq]=null`;
  return req(url);
};

export const getPostsFromCategory = async (slug, current = 1) => {
  const offset = (current - 1) * blogApi.announceLimit;
  const url = `posts?fields=status,img,date_created,slug,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code,categories.categories_id.slug&filter[categories][categories_id][slug][_eq]=${slug}&filter[status][_eq]=published&deep[categories][_filter][categories_id][status][_eq]=published&meta=*&limit=${blogApi.announceLimit}&offset=${offset}&sort=sort,-date_created`;
  return req(url);
};

export const getCountrySlug = async () => {
  const url = `countries?fields=slug,status,posts.posts_id&filter[status]=published&deep[posts][_filter][posts_id][_neq]=null`;
  return req(url);
};

export const getPostsFromCountry = async (slug, current = 1) => {
  const offset = (current - 1) * blogApi.announceLimit;
  const url = `posts?fields=status,img,date_created,slug,countries.countries_id.translations.name,countries.countries_id.translations.languages_id,countries.countries_id.slug,countries.countries_id.status,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code,categories.categories_id.slug&filter[countries][countries_id][slug][_eq]=${slug}&filter[status][_eq]=published&deep[categories][_filter][categories_id][status][_eq]=published&deep[countries][_filter][countries_id][status][_eq]=published&meta=*&limit=${blogApi.announceLimit}&offset=${offset}&sort=sort,-date_created`;
  return req(url);
};

export const getCountries = async () => {
  const url = `countries?fields=posts.posts_id,status,code,slug,translations.languages_code,translations.name&filter[status]=published`;
  return req(url);
};

export const getPostsSlugs = async () => {
  const url = `posts?fields=slug,status&filter[status][_eq]=published`;
  return req(url);
};

export const getPostFromSlug = async (slug, loc) => {
  const locale = languagesApi[loc];
  const url = `posts?fields=status,img,date_created,slug,translations.languages_id,translations.title,translations.content,translations.languages_code,categories.categories_id.status,categories.categories_id.translations.name,categories.categories_id.translations.languages_id&filter[slug][_eq]=${slug}&deep[translations][_filter][languages_code][_eq]=${locale}&deep[categories][_filter][categories_id][status][_neq]=draft`;
  return req(url);
};

export const getAPICountryList = async () => {
  const url = `api_countries?fields=date_created,slug,img,translations.name,translations.languages_code&filter[status][_eq]=published`;
  return req(url);
};

export const getPageSettings = async (item, loc) => {
  const locale = languagesApi[loc];
  const url = `${item}?fields=*,translations.languages_code,translations.seo_block,translations.description,translations.title&filter[status][_eq]=published&deep[translations][_filter][languages_code][_eq]=${locale}`;
  return req(url);
};

export const getAPICountryListSlugs = async () => {
  const url = `api_countries?fields=slug,status&filter[status][_eq]=published`;
  return req(url);
};

export const getCountryFromSlug = async (slug, loc) => {
  const locale = languagesApi[loc];
  const url = `api_countries?fields=status,code,img,date_created,slug,translations.languages_code,translations.name,translations.h1,translations.declension_title,translations.property_list,translations.title,translations.description&filter[slug][_eq]=${slug}&deep[translations][_filter][languages_code][_eq]=${locale}`;
  return req(url);
};

export const getPopularCountry = async (loc) => {
  const locale = languagesApi[loc];
  const url = `api_countries?fields=status,badge_color,name_color,img,popular_img,date_created,slug,translations.name,translations.badge,translations.languages_code&filter[status]=published&deep[translations][_filter][languages_code][_eq]=${locale}&filter[show_popular][_eq]=true&meta=*&sort=sort,-date_created`;
  return req(url);
};
