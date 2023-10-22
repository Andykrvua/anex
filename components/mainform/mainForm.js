import UpField from './form-fields/upField';
import DownField from './form-fields/downField';
import DateField from './form-fields/dateField';
import NightField from './form-fields/nightField';
import PersonField from './form-fields/personField';
import { useState, memo } from 'react';
import {
  useGetUp,
  useGetDown,
  useGetDate,
  useGetNight,
  useGetPerson,
  useGetFieldsNames,
  useSetStartSearch,
  useGetSearchInProgress,
} from '../../store/store';
import declension from 'utils/declension';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import { inputRangeData } from '../../utils/constants';

export default function MainForm() {
  const [modalIsOpen, setModalIsOpen] = useState('');
  const router = useRouter();

  const up = useGetUp();
  const down = useGetDown();
  const date = useGetDate();
  const night = useGetNight();
  const person = useGetPerson();
  const fieldsNames = useGetFieldsNames();
  const setStartSearch = useSetStartSearch();
  const getSearchInProgress = useGetSearchInProgress();

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

  const sumPerson = person.adult + person.child;
  const declensionPerson = declension(sumPerson, tTxt1, tTxt2, tTxt5);
  const personTitle = `${sumPerson} ${declensionPerson}`;

  const MemoUpField = memo(UpField);
  const MemoDownField = memo(DownField);
  const MemoDateField = memo(DateField);
  const MemoNightField = memo(NightField);
  const MemoPersonField = memo(PersonField);

  const makeSearchParams = () => {
    if (getSearchInProgress) {
      return;
    }
    const copiedDate = new Date(date.rawDate);
    copiedDate.setDate(copiedDate.getDate() + date.plusDays);

    const childs = new Array(parseInt(person.child)).fill(null).map((_, ind) => {
      if (person.childAge[ind].toString().length === 1) {
        return '0' + person.childAge[ind].toString();
      } else {
        return person.childAge[ind].toString();
      }
    });

    setStartSearch(true);

    router.push({
      pathname: '/search',
      query: {
        transport: up.transport ? up.transport : 'no',
        from: up.value,
        to: down.value,
        country: down.countryValue,
        checkIn: date.rawDate.toISOString().substr(0, 10),
        checkTo: copiedDate.toISOString().substr(0, 10),
        nights: night.from,
        nightsTo: night.to,
        people: person.adult.toString() + childs.join(''),
        price: inputRangeData.costMin,
        priceTo: inputRangeData.costMax,
        stars: '',
        food: '',
        services: '',
      },
    });
  };

  return (
    <div
      className={
        modalIsOpen
          ? router.pathname === '/search'
            ? 'main_form search_page open'
            : 'main_form open'
          : router.pathname === '/search'
          ? 'main_form search_page'
          : 'main_form'
      }
    >
      <MemoDownField
        title={down?.name[router.locale] || down.name}
        aria={'Город прибытия'}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        popupName={fieldsNames.down}
      />
      <MemoUpField
        title={up?.name[router.locale] || up.name}
        value={up.value}
        aria={'Город вылета'}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        popupName={fieldsNames.up}
      />
      <MemoDateField
        title={date}
        aria={'Дата вылета'}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        popupName={fieldsNames.date}
      />
      <MemoNightField
        title={`${night.from} - ${night.to} ночей`}
        aria={'Количество ночей'}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        popupName={fieldsNames.night}
      />
      <MemoPersonField
        title={personTitle}
        aria={'Количество туристов'}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        popupName={fieldsNames.person}
      />
      <button className="main_form_btn" onClick={() => makeSearchParams()}>
        <FM id="common.search" />
      </button>
    </div>
  );
}
