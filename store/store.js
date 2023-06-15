import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { mainFormPersonValidationRange as personVal } from '../utils/constants';
import { FormattedMessage as FM } from 'react-intl';
// import { defaultDownPoint, defaultUpPoint } from 'utils/constants';
import { persist } from 'zustand/middleware';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
// const date = tomorrow.toISOString().slice(0, 10).split('-').reverse().join('.');
const rawDate = tomorrow;

const defaultDownPoint = {
  name: {
    ru: 'Турция',
    uk: 'Туреччина',
  },
  value: 115,
};

const defaultUpPoint = {
  name: {
    ru: 'Киев',
    uk: 'Київ',
  },
  value: 1544,
};

const useStore = create(
  devtools((set) => ({
    up: {
      name: defaultUpPoint.name,
      value: defaultUpPoint.value,
      transport: 'bus',
    },
    setUp: (up) => set({ up }),
    down: {
      name: defaultDownPoint.name,
      value: defaultDownPoint.value,
      countryValue: 115,
      code: {
        district: false,
        hotel: false,
        img: '/assets/img/svg/flags/code/turkey.svg',
      },
    },
    setDown: (down) => set({ down }),
    initialDate: rawDate,
    date: { rawDate, plusDays: 3 },
    setDate: (date) => set({ date }),
    night: { from: 7, to: 9 },
    setNight: (night) => set({ night }),
    person: {
      adult: 2,
      child: 0,
      childAge: new Array(personVal.childMax).fill(0),
    },
    setPerson: (person) => set({ person }),
    fieldsNames: {
      up: <FM id="mainform.up.t" />,
      down: <FM id="mainform.down.t" />,
      date: <FM id="mainform.date.t" />,
      night: <FM id="mainform.night.t" />,
      person: <FM id="mainform.person.t" />,
    },
    modal: false,
    setModal: (modal) => set({ modal }),
    isFilterOpen: false,
    setIsFilterOpen: (isFilterOpen) => set({ isFilterOpen }),
    burger: false,
    setBurger: (burger) => set({ burger }),
    windowInfo: {
      show: false,
      type: null,
      text: null,
    },
    setWindowInfo: (windowInfo) => set({ windowInfo }),
    searchCountryList: {
      active: false,
      list: [],
    },
    setSearchCountryList: (searchCountryList) => set({ searchCountryList }),
    upPointList: {
      active: false,
      list: [],
    },
    setUpPointList: (upPointList) => set({ upPointList }),
    searchFilter: {
      btnTrigger: false,
      default: {
        change: [],
        cost: [0, 375000],
        hotelRating: {
          5: false,
          4: false,
          3: false,
        },
      },
      newData: {
        change: [],
        cost: [],
        hotelRating: {
          5: false,
          4: false,
          3: false,
        },
      },
      costMin: 0,
      costMax: 375000,
      reset: false,
    },
    setSearchFilter: (data) =>
      set((state) => ({ searchFilter: { ...state.searchFilter, ...data } })),
    applyFilter: false,
    setApplyFilter: (applyFilter) =>
      set({
        applyFilter,
        searchResultSort: {
          price: { active: false, dir: 'asc' },
          rating: { active: false, dir: 'desc' },
        },
      }),
    openStreetMap: {},
    setOpenStreetMap: (openStreetMap) => set({ openStreetMap }),
    startSearch: false,
    setStartSearch: (startSearch) => set({ startSearch }),
    searchInProgress: false,
    setSearchInProgress: (searchInProgress) =>
      set({
        searchInProgress,
        searchResultSort: {
          price: { active: false, dir: 'asc' },
          rating: { active: false, dir: 'desc' },
        },
      }),
    hotelService: {},
    setHotelService: (hotelService) => set({ hotelService }),
    searchResultSort: {
      price: { active: false, dir: 'asc' },
      rating: { active: false, dir: 'desc' },
    },
    setSearchResultSort: (searchResultSort) => set({ searchResultSort }),
    offerParams: {},
    setOfferParams: (offerParams) => set({ offerParams }),
    currentOffer: {},
    setCurrentOffer: (currentOffer) => set({ currentOffer }),
    currentOfferMailData: {},
    setCurrentOfferMailData: (currentOfferMailData) =>
      set({ currentOfferMailData }),
  }))
);

export const useGetUp = () => useStore((state) => state.up);
export const useSetUp = () => useStore((state) => state.setUp);

export const useGetDown = () => useStore((state) => state.down);
export const useSetDown = () => useStore((state) => state.setDown);

export const useGetInitialDate = () => useStore((state) => state.initialDate);
export const useGetDate = () => useStore((state) => state.date);
export const useSetDate = () => useStore((state) => state.setDate);

export const useGetNight = () => useStore((state) => state.night);
export const useSetNight = () => useStore((state) => state.setNight);

export const useGetPerson = () => useStore((state) => state.person);
export const useSetPerson = () => useStore((state) => state.setPerson);

// name for main maenu buttons
export const useGetFieldsNames = () => useStore((state) => state.fieldsNames);

// open/close modal window
export const useGetModal = () => useStore((state) => state.modal);
export const useSetModal = () => useStore((state) => state.setModal);

// open/close filter menu
export const useGetFilterOpen = () => useStore((state) => state.isFilterOpen);
export const useSetFilterOpen = () =>
  useStore((state) => state.setIsFilterOpen);

// open/close burger menu
export const useGetBurger = () => useStore((state) => state.burger);
export const useSetBurger = () => useStore((state) => state.setBurger);

// modal warning type
export const useWindowInfo = () => useStore((state) => state.windowInfo);
export const useSetWindowInfo = () => useStore((state) => state.setWindowInfo);

// search list for current user search request
export const useGetSearchCountryList = () =>
  useStore((state) => state.searchCountryList);
export const useSetSearchCountryList = () =>
  useStore((state) => state.setSearchCountryList);

// up points for current country
export const useGetUpPointList = () => useStore((state) => state.upPointList);
export const useSetUpPointList = () =>
  useStore((state) => state.setUpPointList);

// data for search filter user params
export const useGetSearchFilter = () => useStore((state) => state.searchFilter);
export const useSetSearchFilter = () =>
  useStore((state) => state.setSearchFilter);

// start search for filter data
export const useGetApplyFilter = () => useStore((state) => state.applyFilter);
export const useSetApplyFilter = () =>
  useStore((state) => state.setApplyFilter);

// data for map view
export const useGetOpenStreetMap = () =>
  useStore((state) => state.openStreetMap);
export const useSetOpenStreetMap = () =>
  useStore((state) => state.setOpenStreetMap);

// flag true after make search params
// потрібен щоб визначити прийшов користувач з іншої стоірнки чи ввів урл запит в браузер
export const useGetStartSearch = () => useStore((state) => state.startSearch);
export const useSetStartSearch = () =>
  useStore((state) => state.setStartSearch);

// searching run right now
export const useGetSearchInProgress = () =>
  useStore((state) => state.searchInProgress);
export const useSetSearchInProgress = () =>
  useStore((state) => state.setSearchInProgress);

// save hotels services
export const useGetHotelService = () => useStore((state) => state.hotelService);
export const useSetHotelService = () =>
  useStore((state) => state.setHotelService);

// sort control
export const useGetSearchResultSort = () =>
  useStore((state) => state.searchResultSort);
export const useSetSearchResultSort = () =>
  useStore((state) => state.setSearchResultSort);
// offer page req params
export const useGetOfferParams = () => useStore((state) => state.offerParams);
export const useSetOfferParams = () =>
  useStore((state) => state.setOfferParams);
// current offer
export const useGetCurrentOffer = () => useStore((state) => state.currentOffer);
export const useSetCurrentOffer = () =>
  useStore((state) => state.setCurrentOffer);
// current offer mail data
export const useGetCurrentOfferMailData = () =>
  useStore((state) => state.currentOfferMailData);
export const useSetCurrentOfferMailData = () =>
  useStore((state) => state.setCurrentOfferMailData);
//current offer
