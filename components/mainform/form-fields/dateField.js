import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import MainFormBtn from './mainFormBtn';
import { svgDate } from './svg';
import Loader from 'components/common/loader';
import { formattedDate } from '../../../utils/formattedDate';
import { useGetDate, useGetInitialDate } from '../../../store/store';
import { getDateRangeLabel } from '../../../utils/dateRange';

const DynamicUpWindow = dynamic(
  () => import(/* webpackChunkName: "Date" */ '../popups/multiple-datepicker'),
  {
    ssr: false,
    loading: () => {
      return <Loader />;
    },
  }
);

export default function DateField({
  aria,
  modalIsOpen,
  setModalIsOpen,
  popupName,
}) {
  const date = useGetDate();
  const initialDate = useGetInitialDate();
  const title = useMemo(
    () => getDateRangeLabel(date, formattedDate, initialDate),
    [date, initialDate],
  );

  return (
    <MainFormBtn
      cName={'btn_date'}
      title={title}
      aria={aria}
      svg={svgDate}
      plusDays={date.plusDays}
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
    >
      <DynamicUpWindow
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        cName={'btn_date'}
        popupName={popupName}
      />
    </MainFormBtn>
  );
}
