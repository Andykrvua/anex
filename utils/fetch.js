import { blogApi } from './constants';

export const getPostsList = async (current = 1) => {
  const offset = (current - 1) * blogApi.announceLimit;
  const posts = await fetch(
    `${process.env.API}posts?fields=*,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code&filter[status]=published&deep[categories][_filter][categories_id][status][_eq]=published&meta=*&limit=${blogApi.announceLimit}&offset=${offset}&sort=sort,-date_created`
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .catch((errors) => {
      return { errors };
    });

  return posts;
};

export const getPostsMeta = async () => {
  const postsMeta = await fetch(
    `${process.env.API}posts?meta=*&limit=0&filter[status]=published`
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .catch((errors) => {
      return { errors };
    });

  const filter_count = postsMeta.meta.filter_count;
  return filter_count;
};

export const getCategories = async () => {
  const categories = await fetch(
    `${process.env.API}categories?fields=status,slug,bg_color,translations.languages_id,translations.name&filter[status]=published`
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .catch((errors) => {
      return { errors };
    });

  return categories;
};

export const getCategoriesSlug = async () => {
  const categoriesSlug = await fetch(
    `${process.env.API}categories?fields=slug,status,posts.posts_id&filter[status]=published&deep[posts][_filter][posts_id][_neq]=null`
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .catch((errors) => {
      return { errors };
    });

  return categoriesSlug;
};

export const getPostsFromCategory = async (slug, current = 1) => {
  const offset = (current - 1) * blogApi.announceLimit;
  const postsCat = await fetch(
    `${process.env.API}posts?fields=*,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code,categories.categories_id.slug&filter[categories][categories_id][slug][_eq]=${slug}&filter[status][_eq]=published&deep[categories][_filter][categories_id][status][_eq]=published&meta=*&limit=${blogApi.announceLimit}&offset=${offset}&sort=sort,-date_created`
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .catch((errors) => {
      return { errors };
    });

  return postsCat;
};

export const getCountrySlug = async () => {
  const countriesSlug = await fetch(
    `${process.env.API}countries?fields=slug,status,posts.posts_id&filter[status]=published&deep[posts][_filter][posts_id][_neq]=null`
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .catch((errors) => {
      return { errors };
    });

  return countriesSlug;
};

export const getPostsFromCountry = async (slug, current = 1) => {
  const offset = (current - 1) * blogApi.announceLimit;
  const postsCountry = await fetch(
    `${process.env.API}posts?fields=*,countries.countries_id.translations.name,countries.countries_id.translations.languages_id,countries.countries_id.slug,countries.countries_id.status,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code,categories.categories_id.slug&filter[countries][countries_id][slug][_eq]=${slug}&filter[status][_eq]=published&deep[categories][_filter][categories_id][status][_eq]=published&deep[countries][_filter][countries_id][status][_eq]=published&meta=*&limit=${blogApi.announceLimit}&offset=${offset}&sort=sort,-date_created`
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .catch((errors) => {
      return { errors };
    });

  return postsCountry;
};

export const getCountries = async () => {
  const categories = await fetch(
    `${process.env.API}countries?fields=status,slug,translations.languages_code,translations.name&filter[status]=published`
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Something went wrong');
    })
    .catch((errors) => {
      return { errors };
    });

  return categories;
};
