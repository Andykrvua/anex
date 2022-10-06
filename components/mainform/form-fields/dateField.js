import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import MainFormBtn from './mainFormBtn';
import { svgDate } from './svg';
import Loader from 'components/common/loader';
import { formattedDate } from '../../../utils/formattedDate';
import declension from '../../../utils/declension';
import { useIntl } from 'react-intl';

const DynamicUpWindow = dynamic(
  () => import(/* webpackChunkName: "Date" */ '../popups/date'),
  {
    ssr: false,
    loading: () => {
      return <Loader />;
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
  const storeDate = title.rawDate;
  const plusDays = title.plusDays;

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
        storeDate={storeDate}
        initialPlusDays={plusDays}
      />
    </MainFormBtn>
  );
}
