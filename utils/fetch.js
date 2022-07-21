import { blogApi } from './constants';
import { languagesApi } from './constants';

export const getPostsList = async (current = 1) => {
  const offset = (current - 1) * blogApi.announceLimit;
  const posts = await fetch(
    `${process.env.API}posts?fields=status,img,date_created,slug,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code&filter[status]=published&deep[categories][_filter][categories_id][status][_eq]=published&meta=*&limit=${blogApi.announceLimit}&offset=${offset}&sort=sort,-date_created`
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

export const getLastPost = async (limit = 3, loc, slug) => {
  const locale = languagesApi[loc];
  const posts = await fetch(
    `${process.env.API}posts?fields=status,img,date_created,slug,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code&filter[status]=published&deep[categories][_filter][categories_id][status][_eq]=published&deep[categories][categories_id][translations][_filter][languages_id][_eq]=${locale}&deep[translations][_filter][languages_code][_eq]=${locale}&limit=${limit}&sort=sort,-date_created&filter[slug][_neq]=${slug}`
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
    `${process.env.API}posts?fields=status,img,date_created,slug,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code,categories.categories_id.slug&filter[categories][categories_id][slug][_eq]=${slug}&filter[status][_eq]=published&deep[categories][_filter][categories_id][status][_eq]=published&meta=*&limit=${blogApi.announceLimit}&offset=${offset}&sort=sort,-date_created`
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
    `${process.env.API}posts?fields=status,img,date_created,slug,countries.countries_id.translations.name,countries.countries_id.translations.languages_id,countries.countries_id.slug,countries.countries_id.status,categories.categories_id.translations.name,categories.categories_id.translations.languages_id,categories.categories_id.bg_color,translations.title,translations.languages_code,categories.categories_id.slug&filter[countries][countries_id][slug][_eq]=${slug}&filter[status][_eq]=published&deep[categories][_filter][categories_id][status][_eq]=published&deep[countries][_filter][countries_id][status][_eq]=published&meta=*&limit=${blogApi.announceLimit}&offset=${offset}&sort=sort,-date_created`
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
    `${process.env.API}countries?fields=posts.posts_id,status,code,slug,translations.languages_code,translations.name&filter[status]=published`
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

export const getPostsSlugs = async () => {
  const posts = await fetch(
    `${process.env.API}posts?fields=slug,status&filter[status][_eq]=published`
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

export const getPostFromSlug = async (slug, loc) => {
  const locale = languagesApi[loc];

  const post = await fetch(
    `${process.env.API}posts?fields=status,img,date_created,slug,translations.languages_id,translations.title,translations.content,translations.languages_code,categories.categories_id.status,categories.categories_id.translations.name,categories.categories_id.translations.languages_id&filter[slug][_eq]=${slug}&deep[translations][_filter][languages_code][_eq]=${locale}&deep[categories][_filter][categories_id][status][_neq]=draft`
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

  return post;
};

export const getAPICountryList = async () => {
  const countryList = await fetch(
    `${process.env.API}api_countries?fields=date_created,slug,img,translations.name,translations.languages_code&filter[status][_eq]=published`
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

  return countryList;
};

export const getAPICountryListSlugs = async () => {
  const countrySlugs = await fetch(
    `${process.env.API}api_countries?fields=slug,status&filter[status][_eq]=published`
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

  return countrySlugs;
};

export const getCountryFromSlug = async (slug, loc) => {
  const locale = languagesApi[loc];

  const post = await fetch(
    `${process.env.API}api_countries?fields=status,img,date_created,slug,translations.languages_code,translations.name&filter[slug][_eq]=${slug}&deep[translations][_filter][languages_code][_eq]=${locale}`
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

  return post;
};

export const getPopularCountry = async (loc) => {
  const locale = languagesApi[loc];

  const posts = await fetch(
    `${process.env.API}api_countries?fields=status,badge_color,name_color,img,date_created,slug,translations.name,translations.badge,translations.languages_code&filter[status]=published&deep[translations][_filter][languages_code][_eq]=${locale}&filter[show_popular][_eq]=true&meta=*&sort=sort,-date_created`
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
