import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgUp } from './svg';
import Loader from 'components/common/loader';

const DynamicUpWindow = dynamic(
  () => import(/* webpackChunkName: "Up" */ '../popups/up'),
  {
    ssr: false,
    loading: () => {
      return <Loader />;
    },
  }
);

export default function UpField({
  title,
  aria,
  modalIsOpen,
  setModalIsOpen,
  popupName,
  value,
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
        value={value}
      />
    </MainFormBtn>
  );
}
