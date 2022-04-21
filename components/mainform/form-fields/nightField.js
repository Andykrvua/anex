import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgNight } from './svg';
import LoadingPlaceholder from './loadingPlaceholder';

const DynamicUpWindow = dynamic(
  () => import(/* webpackChunkName: "Night" */ '../popups/night'),
  {
    ssr: false,
    loading: () => {
      return <LoadingPlaceholder />;
    },
  }
);

export default function NightField({
  title,
  aria,
  modalIsOpen,
  setModalIsOpen,
  popupName,
}) {
  return (
    <MainFormBtn
      cName={'btn_night'}
      title={title}
      aria={aria}
      svg={svgNight}
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
    >
      <DynamicUpWindow
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        cName={'btn_night'}
        popupName={popupName}
      />
    </MainFormBtn>
  );
}
