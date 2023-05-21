import { server } from 'utils/utils';

export default function getCountriesSiteMap() {
  const staticPaths = [
    { url: `${server}/blog/`, date: null },
    { url: `${server}/contacts/`, date: null },
    { url: `${server}/countries/`, date: null },
    { url: `${server}/podarochnye-sertifikaty/`, date: null },
    { url: `${server}/reviews/`, date: null },
    { url: `${server}/tours/`, date: null },
  ];

  const staticPathsUk = [
    { url: `${server}/uk/blog/`, date: null },
    { url: `${server}/uk/contacts/`, date: null },
    { url: `${server}/uk/countries/`, date: null },
    { url: `${server}/uk/podarochnye-sertifikaty/`, date: null },
    { url: `${server}/uk/reviews/`, date: null },
    { url: `${server}/uk/tours/`, date: null },
  ];

  return { staticPaths, staticPathsUk };
}
