import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgPerson } from './svg';
import LoadingPlaceholder from './loadingPlaceholder';

const DynamicUpWindow = dynamic(
  () => import(/* webpackChunkName: "Person" */ '../popups/person'),
  {
    ssr: false,
    loading: () => {
      return <LoadingPlaceholder />;
    },
  }
);

export default function PersonField({
  title,
  aria,
  modalIsOpen,
  setModalIsOpen,
  popupName,
}) {
  return (
    <MainFormBtn
      cName={'btn_person'}
      title={title}
      aria={aria}
      svg={svgPerson}
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
    >
      <DynamicUpWindow
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        cName={'btn_person'}
        popupName={popupName}
      />
    </MainFormBtn>
  );
}
