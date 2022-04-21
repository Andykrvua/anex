import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgDown } from './svg';
import LoadingPlaceholder from './loadingPlaceholder';

const DynamicUpWindow = dynamic(
  () => import(/* webpackChunkName: "Down" */ '../popups/down'),
  {
    ssr: false,
    loading: () => {
      return <LoadingPlaceholder />;
    },
  }
);

export default function DownField({
  title,
  aria,
  modalIsOpen,
  setModalIsOpen,
  popupName,
}) {
  return (
    <MainFormBtn
      cName={'btn_down'}
      title={title}
      aria={aria}
      svg={svgDown}
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
    >
      <DynamicUpWindow
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        cName={'btn_down'}
        popupName={popupName}
      />
    </MainFormBtn>
  );
}
