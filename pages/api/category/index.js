import { getCategoriesSlug } from 'utils/fetch';
import { blogApi } from 'utils/constants';

export default async function handler(req, res) {
  const categoriesSlug = await getCategoriesSlug();
  const rawCatSlugs = categoriesSlug.data;
  console.log('rawCatSlugs1', rawCatSlugs);
  for (let i = 0; i < rawCatSlugs.length; i++) {
    const pagesCount = Math.ceil(
      rawCatSlugs[i].posts.length / blogApi.announceLimit
    );

    rawCatSlugs[i].posts = [];

    Array(pagesCount)
      .fill(null)
      .map((_, ind) => {
        return rawCatSlugs[i].posts.push(ind + 2);
      });
    rawCatSlugs[i].posts.pop();
  }
  // console.log('rawCatSlugs', rawCatSlugs);
  // const catSlugs = [];
  // rawCatSlugs.map((item) => {
  //   return catSlugs.push(item.slug);
  // });

  res.status(200).json({
    // catSlugs,
    rawCatSlugs,
  });
}
