import { getAllToursTextPages } from 'utils/fetch';
import { server } from 'utils/utils';

export default async function getToursSiteMap() {
  const toursRu = await getAllToursTextPages('ru');
  const toursUk = await getAllToursTextPages('uk');
  let toursPaths = [];
  let toursPathUk = [];

  if (toursRu.data) {
    toursPaths = toursRu.data.map(({ slug, subpage, subsubpage }) => {
      if (subsubpage && subpage && slug) {
        return { url: `${server}/tours/${slug}/${subpage}/${subsubpage}/` };
      } else if (subpage && slug) {
        return { url: `${server}/tours/${slug}/${subpage}/` };
      } else if (slug) {
        return { url: `${server}/tours/${slug}/` };
      }
    });
  }

  if (toursUk.data) {
    toursPathUk = toursUk.data.map(({ slug, subpage, subsubpage }) => {
      if (subsubpage && subpage && slug) {
        return { url: `${server}/uk/tours/${slug}/${subpage}/${subsubpage}/` };
      } else if (subpage && slug) {
        return { url: `${server}/uk/tours/${slug}/${subpage}/` };
      } else if (slug) {
        return { url: `${server}/uk/tours/${slug}/` };
      }
    });
  }

  return { toursPaths, toursPathUk };
}
