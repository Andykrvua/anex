import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgUp } from './svg';
import LoadingPlaceholder from './loadingPlaceholder';

const DynamicUpWindow = dynamic(
  () => import(/* webpackChunkName: "Up" */ '../popups/up'),
  {
    ssr: false,
    loading: () => {
      return <LoadingPlaceholder />;
    },
  }
);

export default function UpField({
  title,
  aria,
  modalIsOpen,
  setModalIsOpen,
  popupName,
}) {
  return (
    <MainFormBtn
      cName={'btn_up'}
      title={title}
      aria={aria}
      svg={svgUp}
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
    >
      <DynamicUpWindow
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        cName={'btn_up'}
        popupName={popupName}
      />
    </MainFormBtn>
  );
}
