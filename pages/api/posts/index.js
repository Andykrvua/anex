import { getPostsMeta } from 'utils/fetch';

export default async function handler(req, res) {
  const postsMeta = await getPostsMeta();
  const filter_count = postsMeta.meta.filter_count;
  res.status(200).json({
    filter_count,
  });
}
