// variants from use component countryList
export const countryListVariants = {
  getSearch: 'getSearch',
  getSearchPopular: 'getSearchPopular',
  getNavMenu: 'getNavMenu',
};

// base css transition
export const transitionTime = 300;

// night popup validation range
export const mainFormNightValidationRange = {
  fromMin: 1,
  fromMax: 28,
  toMin: 3,
  toMax: 30,
  defaultFrom: 7,
  defaultTo: 9,
};

// person popup validation range
export const mainFormPersonValidationRange = {
  adultMin: 1,
  adultMax: 8,
  childMin: 0,
  childMax: 4,
  childAgeMin: 1,
  childAgeMax: 16,
};

// component location
export const location = {
  logo: {
    burger: 'burger',
  },
  postContent: {
    countryPage: 'countryPage',
    tourPage: 'tourPage',
  },
  districtList: {
    allToursPage: 'allToursPage',
    busToursPage: 'busToursPage',
  },
  nav: {
    desktop: 'desktop',
    mobile: 'mobile',
  },
};

// switch menu margin
export const switchMenuMargins = {
  lrMargin: 5,
  insideMargin: 10,
};

// blog and country cards width
export const bcCardsWidth = {
  cardSize: 310,
};

export const carouselInstance = {
  blog: 'blog',
  popularCountry: 'countries',
};

export const languages = {
  ru: 'ru',
  uk: 'uk',
};

// lang name from internal api fetch
export const languagesApi = {
  ru: 'ru-RU',
  uk: 'uk-UA',
};

// lang name from external api fetch
export const languagesOperatorApi = {
  ru: 'ru',
  uk: 'ua',
};

// blog announce count
export const blogApi = {
  announceLimit: 6,
};

// info modal styles
export const infoModal = {
  ok: 'ok',
  error: 'error',
  info: 'info',
  warning: 'warning',
};

// info modal show time
export const showTime = {
  time: 3000,
};

// number of district cards to show switcher
export const districtCardsShowSwitcher = 6;

// reviews atacchment folder id
export const reviewsAtacchmentFolderId = '699934e4-e808-4a71-995c-716a92037de8';

// reviews handler path
export const reviewsHandlerPath = '/api/review';

// reviews handler path
export const reviewsPerPage = 10;

// modal content
export const modal = {
  leadGetTours: 'leadGetTours',
  leadRequestCall: 'leadRequestCall',
  favorites: 'favorites',
  hotelCardsMap: 'hotelCardsMap',
  offerPageChangePerson: 'offerPageChangePerson',
  offerPageChangeNight: 'offerPageChangeNight',
  offerPageChangeRoom: 'offerPageChangeRoom',
  offerPageOrder: 'offerPageOrder',
  hotelimg: 'hotelimg',
};

// time to fetch request
export const fetchTime = {
  minOffer: 18000,
};

// default down point
// export const defaultDownPoint = {
//   name: {
//     ru: 'Турция',
//     uk: 'Туреччина',
//   },
//   value: 115,
// };

// default up point
// export const defaultUpPoint = {
//   name: {
//     ru: 'Киев',
//     uk: 'Київ',
//   },
//   value: 1544,
// };

// icons from Up modale
export const transportIcon = {
  bus: 'bus.svg',
  air: 'fly-up.svg',
  train: 'close.svg',
  ship: 'close.svg',
  no: 'person.svg',
};

//
// API
//

// api version
export const api_version = '2.6';

// fetch value from stars hotels
export const stars = {
  hv1: 5,
  five: 5,
  four: 4,
  three: 3,
  two: 2,
  one: 1,
};

// img url
export const fetchImgUrl = 'https://newimg.otpusk.com';

// search res Carpathians
export const carpathiansId = 55;

// food variants for cards
export const food = {
  ob: 'result.food.ob',
  bb: 'result.food.bb',
  hb: 'result.food.hb',
  fb: 'result.food.fb',
  al: 'result.food.al',
  ai: 'result.food.ai',
  uai: 'result.food.uai',
};

// food variants for filter search
export const foodFilterItems = {
  ob: 'result.food.ob',
  bb: 'result.food.bb',
  hb: 'result.food.hb',
  fb: 'result.food.fb',
  ai: 'result.food.ai',
  uai: 'result.food.uai',
};

// food variants for modal change room search
export const foodAll = [
  { name: 'AI', translate: 'result.food.ai' },
  { name: 'FB', translate: 'result.food.fb' },
  { name: 'HB', translate: 'result.food.hb' },
  { name: 'BB', translate: 'result.food.bb' },
  { name: 'OB', translate: 'result.food.ob' },
];

// code pop country from to modal
export const popCountryCode = [
  'egypt',
  'turkey',
  'montenegro',
  'bulgaria',
  'uae',
  'greece',
  'dominican_republic',
  'maldives',
];

// ignore operators
/**
 * "id": 3342,
 * "name": "Center",
 *
 * "id": 3371,
 * "name": "Itaka",
 *
 * "id": 3384,
 * "name": "Poland",
 *
 * "id": 3372,
 * "name": "Rainbow",
 *
 * "id": 3326,
 * "name": "Tour-Group",
 *
 * "id": 2700,
 * "name": "TPG",
 */
export const ignoreOperators = 'ignoreOperators=3342,3371,3384,3372,3326,2700&';

// default price values
export const inputRangeData = {
  costMin: 0,
  costMax: 375000,
};
