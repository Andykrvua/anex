import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgUp, svgBus, svgNo } from './svg';
import Loader from 'components/common/loader';
import { useGetUp } from 'store/store';

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
  const getUp = useGetUp();

  const headerTransportIcon = {
    bus: svgBus,
    air: svgUp,
    no: svgNo,
  };

  return (
    <MainFormBtn
      cName={'btn_up'}
      title={title}
      aria={aria}
      svg={getUp.transport ? headerTransportIcon[getUp.transport] : svgUp}
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
