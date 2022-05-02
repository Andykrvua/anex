import create from 'zustand';
import { devtools } from 'zustand/middleware';

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
    date: { rawDate, plusDays: 3 },
    setDate: (date) => set({ date }),
    night: { from: 10, to: 15 },
    setNight: (night) => set({ night }),
    person: '2 туриста',
    setPerson: (person) => set({ person }),
    fieldsNames: {
      up: 'Откуда вылет',
      down: 'Куда отправляемся',
      date: 'Дата вылета',
      night: 'Длительность',
      person: 'Туристы',
    },
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

export const getUp = () => useStore((state) => state.up);
export const setUp = (up) => useStore((state) => state.setUp);

export const getDown = () => useStore((state) => state.down);
export const setDown = (down) => useStore((state) => state.setDown);

export const getDate = () => useStore((state) => state.date);
export const setDate = (date) => useStore((state) => state.setDate);

export const getNight = () => useStore((state) => state.night);
export const setNight = (night) => useStore((state) => state.setNight);

export const getPerson = () => useStore((state) => state.person);
export const setPerson = (person) => useStore((state) => state.setPerson);

export const getFieldsNames = () => useStore((state) => state.fieldsNames);

// example
// export const useLogin = () => useStore((state) => state.login);
// export const useLogout = () => useStore((state) => state.logout);
// export const useAddToCart = (num) => useStore((state) => state.addToCart);
// export const useUser = () => useStore((state) => state.user);
// export const useCartCount = () => useStore((state) => state.cartCount);
// export const usefirstName = () => useStore((state) => state.firstName);
// export const useSetFirstName = (firstName) =>
//   useStore((state) => state.setFirstName);
