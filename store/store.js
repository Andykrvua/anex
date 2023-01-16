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
    up: { name: defaultUpPoint.name, value: defaultUpPoint.value },
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
    night: { from: 10, to: 15 },
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
    searchUrl: '',
    setSearchUrl: (searchUrl) => set({ searchUrl }),
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
      test: 'hfhfhhf',
    },
    setSearchFilter: (data) =>
      set((state) => ({ searchFilter: { ...state.searchFilter, ...data } })),
    applyFilter: false,
    setApplyFilter: (applyFilter) => set({ applyFilter }),
    openStreetMap: {},
    setOpenStreetMap: (openStreetMap) => set({ openStreetMap }),
    startSearch: false,
    setStartSearch: (startSearch) => set({ startSearch }),
    searchInProgress: false,
    setSearchInProgress: (searchInProgress) => set({ searchInProgress }),
    hotelService: {},
    setHotelService: (hotelService) => set({ hotelService }),
    // user: '',
    // cartCount: 0,
    // firstName: 'React',
    // anyModalIsOpen: false,
    // isOpening: false,
    // btn_up: false,
    // btn_down: false,
    // btn_date: false,
    // btn_night: false,
    // btn_person: false,
    // setFirstName: (firstName) => set({ firstName }),
    // login: () => set(() => ({ user: 'John' })),
    // logout: () => set(() => ({ user: '' })),
    // addToCart: (num) => set((state) => ({ cartCount: state.cartCount + num })),
    // setModalState: (title) =>
    //   set((state) => ({
    //     [title]: !state[title],
    //   })),
    // setAnyModalIsOpen: () =>
    //   set((state) => ({
    //     anyModalIsOpen: !state.anyModalIsOpen,
    //   })),
  }))
);

// export const useSetModalState = (title) =>
//   useStore((state) => state.setModalState);
// export const getAnyModalIsOpen = () =>
//   useStore((state) => state.anyModalIsOpen);
// export const getModalState = (title) => useStore((state) => state[title]);
// export const useSetAnyModalIsOpen = () =>
//   useStore((state) => state.setAnyModalIsOpen);

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

// current search url
export const useGetSearchUrl = () => useStore((state) => state.searchUrl);
export const useSetSearchUrl = () => useStore((state) => state.setSearchUrl);

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

//
export const useGetHotelService = () => useStore((state) => state.hotelService);
export const useSetHotelService = () =>
  useStore((state) => state.setHotelService);
// example
// export const useLogin = () => useStore((state) => state.login);
// export const useLogout = () => useStore((state) => state.logout);
// export const useAddToCart = (num) => useStore((state) => state.addToCart);
// export const useUser = () => useStore((state) => state.user);
// export const useCartCount = () => useStore((state) => state.cartCount);
// export const usefirstName = () => useStore((state) => state.firstName);
// export const useSetFirstName = (firstName) =>
//   useStore((state) => state.setFirstName);
