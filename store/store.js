import create from 'zustand';
import { devtools } from 'zustand/middleware';
import { mainFormPersonValidationRange as personVal } from '../utils/constants';
import { FormattedMessage as FM } from 'react-intl';

const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
// const date = tomorrow.toISOString().slice(0, 10).split('-').reverse().join('.');
const rawDate = tomorrow;

const useStore = create(
  devtools((set) => ({
    up: 'Запорожье',
    setUp: (up) => set({ up }),
    down: 'Сейшельские о-ва',
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
    burger: false,
    setBurger: (burger) => set({ burger }),
    windowInfo: {
      show: false,
      type: null,
      text: null,
    },
    setWindowInfo: (windowInfo) => set({ windowInfo }),
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

export const useGetFieldsNames = () => useStore((state) => state.fieldsNames);

export const useGetModal = () => useStore((state) => state.modal);
export const useSetModal = () => useStore((state) => state.setModal);

export const useGetBurger = () => useStore((state) => state.burger);
export const useSetBurger = () => useStore((state) => state.setBurger);

export const useWindowInfo = () => useStore((state) => state.windowInfo);
export const useSetWindowInfo = () => useStore((state) => state.setWindowInfo);

// example
// export const useLogin = () => useStore((state) => state.login);
// export const useLogout = () => useStore((state) => state.logout);
// export const useAddToCart = (num) => useStore((state) => state.addToCart);
// export const useUser = () => useStore((state) => state.user);
// export const useCartCount = () => useStore((state) => state.cartCount);
// export const usefirstName = () => useStore((state) => state.firstName);
// export const useSetFirstName = (firstName) =>
//   useStore((state) => state.setFirstName);
