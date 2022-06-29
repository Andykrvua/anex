import { getPostsList, getCategories } from 'utils/fetch';

export default async function handler(req, res) {
  const { page } = req.query;
  const postsList = await getPostsList(page);
  const resCategoryList = await getCategories();

  const categoryList = resCategoryList.data;
  res.status(200).json({
    postsList,
    categoryList,
  });
}
