import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgDate } from './svg';
import { useMemo } from "react";
import { useGetDate, useGetInitialDate } from "../../../store/store";
import { formattedDate } from "../../../utils/formattedDate";
import { addDays, isSameDay } from "date-fns";

import Loader from 'components/common/loader';


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
  const plusDays = useMemo(() => date.plusDays,[date]);
  const initialDate = useGetInitialDate();


  const title = useMemo(() => `${formattedDate(date.rawDate)} - ${formattedDate(addDays(date.rawDate,date.additionalDays - (isSameDay(date.rawDate, initialDate) ? 0 : 1)))}`,[date]);

  return (
    <MainFormBtn
      title={title}
      cName={'btn_date'}
      wrapperClassName="main_form_popup_with_datepicker"
      aria={aria}
      svg={svgDate}
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
      plusDays={plusDays}
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
