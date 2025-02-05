import dynamic from 'next/dynamic';
import MainFormBtn from './mainFormBtn';
import { svgDate } from './svg';
import { useEffect, useMemo, useState } from "react";
import { useIntl } from "react-intl";
import declension from "../../../utils/declension";
import { useGetDate } from "../../../store/store";
import { formattedDate } from "../../../utils/formattedDate";

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
  // не могу получить дату во внутреннем компоненте, хз
  // const tomorrow = new Date();
  // // tomorrow.setDate(tomorrow.getDate() + 1);
  // tomorrow.setDate(tomorrow.getDate() - 15);
  // const initialDate = tomorrow;
  const date = useGetDate();
  const plusDays = useMemo(() => date.plusDays,[date]);
  const intl = useIntl();
  const dTxt1 = intl.formatMessage({
    id: 'common.day1',
  });
  const dTxt2 = intl.formatMessage({
    id: 'common.day2',
  });
  const dTxt5 = intl.formatMessage({
    id: 'common.day5',
  });

  const [dayText, setDayText] = useState(dTxt2);

  useEffect(() => {
        setDayText(declension(plusDays, dTxt1, dTxt2, dTxt5));
  }, [plusDays]);

  const SecondaryBtn = () => {
        return (
            <div className="second_btn_date">
                <span className="second_btn_date__text">
                  +{plusDays} {dayText}
                </span>
            </div>
        );
  };

  const title = useMemo(() => formattedDate(date.rawDate),[date]);

  return (
    <MainFormBtn
      title={title}
      cName={'btn_date'}
      wrapperClassName="main_form_popup_with_datepicker"
      aria={aria}
      svg={svgDate}
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
      SecondaryBtn={SecondaryBtn}
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
