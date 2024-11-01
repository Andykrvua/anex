import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgPerson } from './svg';
import Loader from 'components/common/loader';
import declension from 'utils/declension';
import { useIntl } from 'react-intl';
import { useGetPerson } from '../../../store/store';

const DynamicUpWindow = dynamic(
  () => import(/* webpackChunkName: "Person" */ '../popups/person'),
  {
    ssr: false,
    loading: () => {
      return <Loader />;
    },
  }
);

export default function PersonField({
  modalIsOpen,
  setModalIsOpen,
  popupName,
}) {
  const { adult, child } = useGetPerson();
  const intl = useIntl();

  const tTxt1 = intl.formatMessage({
    id: 'common.tourist1',
  });
  const tTxt2 = intl.formatMessage({
    id: 'common.tourist2',
  });
  const tTxt5 = intl.formatMessage({
    id: 'common.tourist5',
  });

  const sumPerson = adult + child;
  const declensionPerson = declension(sumPerson, tTxt1, tTxt2, tTxt5);
  const personTitle = `${sumPerson} ${declensionPerson}`;

  return (
    <MainFormBtn
      cName={'btn_person'}
      title={personTitle}
      aria={'Количество туристов'}
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
