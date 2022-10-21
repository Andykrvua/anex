import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgDown } from './svg';
import Loader from 'components/common/loader';

const DynamicUpWindow = dynamic(
  () => import(/* webpackChunkName: "Down" */ '../popups/down'),
  {
    ssr: false,
    loading: () => {
      return <Loader />;
    },
  }
);

export default function DownField({
  title,
  aria,
  modalIsOpen,
  setModalIsOpen,
  popupName,
  ttt,
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
        ttt={ttt}
      />
    </MainFormBtn>
  );
}
