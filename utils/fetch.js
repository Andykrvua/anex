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
  console.log('filter_count: ', filter_count);
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
  const resCatSlug = await fetch(
    `${process.env.API}categories?fields=slug,status,posts.posts_id&filter[status]=published&deep[posts][_filter][posts_id][_neq]=null`
  );
  const catSlug = await resCatSlug.json();

  return catSlug;
};

export const getPostsFromCategory = async (slug, current = 1) => {
  console.log('current', current);
  const offset = (current - 1) * blogApi.announceLimit;
  console.log('offset', offset);
  const resPostsCat = await fetch(
    `${process.env.API}posts?fields=*,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code,categories.categories_id.slug&filter[categories][categories_id][slug][_eq]=${slug}&filter[status][_eq]=published&meta=*&limit=${blogApi.announceLimit}&offset=${offset}&sort=sort,-date_created`
  );
  const postsCat = await resPostsCat.json();

  return postsCat;
};
