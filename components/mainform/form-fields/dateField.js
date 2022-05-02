import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import MainFormBtn from './mainFormBtn';
import { svgDate } from './svg';
import LoadingPlaceholder from './loadingPlaceholder';
import { formattedDate } from '../../../utils/formattedDate';
import declension from '../../../utils/declension';

const DynamicUpWindow = dynamic(
  () => import(/* webpackChunkName: "Date" */ '../popups/date'),
  {
    ssr: false,
    loading: () => {
      return <LoadingPlaceholder />;
    },
  }
);

export default function DateField({
  title,
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

  const initialDate = title.rawDate;
  const plusDays = title.plusDays;

  const [dayText, setDayText] = useState('дня');

  useEffect(() => {
    setDayText(declension(plusDays, 'день', 'дня', 'дней'));
  }, [plusDays]);

  title = formattedDate(title.rawDate);

  const SecondaryBtn = () => {
    return (
      <div className="second_btn_date">
        <span className="second_btn_date__text">
          +{plusDays} {dayText}
        </span>
      </div>
    );
  };

  return (
    <MainFormBtn
      cName={'btn_date'}
      title={title}
      aria={aria}
      svg={svgDate}
      SecondaryBtn={SecondaryBtn}
      modalIsOpen={modalIsOpen}
      setModalIsOpen={setModalIsOpen}
    >
      <DynamicUpWindow
        setModalIsOpen={setModalIsOpen}
        modalIsOpen={modalIsOpen}
        cName={'btn_date'}
        popupName={popupName}
        initialDate={initialDate}
        initialPlusDays={plusDays}
      />
    </MainFormBtn>
  );
}
