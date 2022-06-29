import { getPostsFromCategory, getCategories } from 'utils/fetch';

export default async function handler(req, res) {
  const slug = req.query.slug;
  let page;
  console.log('req.query', req.query);
  console.log('req.slug', slug);
  console.log('req.page', page);

  req.query.page ? (page = req.query.page) : (page = 1);

  const postsList = await getPostsFromCategory(slug, page);
  const resCategoryList = await getCategories();

  const categoryList = resCategoryList.data;
  // const rawCatSlugs = categoriesSlug.data;
  // const catSlugs = [];
  // rawCatSlugs.map((item) => {
  //   return catSlugs.push(item.slug);
  // });

  res.status(200).json({
    postsList,
    categoryList,
  });
}
