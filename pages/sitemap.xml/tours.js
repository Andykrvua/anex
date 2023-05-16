import { getAllToursTextPages } from "utils/fetch";
import { server } from "utils/utils";


export default async function getToursSiteMap(){
  const toursRu = await getAllToursTextPages("ru");
  const toursUk = await getAllToursTextPages("uk");
  let toursPaths = [];
  let toursPathUk = [];

  if (toursRu.data) {
    toursPaths = toursRu.data.map(({ slug }) => ({
      url: `${server}/tours/${slug}/`,
    }));
  }

  if (toursUk.data) {
    toursPathUk = toursUk.data.map(({ slug }) => ({
      url: `${server}/uk/tours/${slug}/`,
    }));
  }

  return { toursPaths, toursPathUk };
}
