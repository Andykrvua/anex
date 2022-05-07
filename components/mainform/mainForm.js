import UpField from './form-fields/upField';
import DownField from './form-fields/downField';
import DateField from './form-fields/dateField';
import NightField from './form-fields/nightField';
import PersonField from './form-fields/personField';
import { useState } from 'react';
import {
  useGetUp,
  useGetDown,
  useGetDate,
  useGetNight,
  useGetPerson,
  useGetFieldsNames,
} from '../../store/store';
import declension from 'utils/declension';
import { FormattedMessage as FM, useIntl } from 'react-intl';

export default function MainForm() {
  const [modalIsOpen, setModalIsOpen] = useState('');

  const up = useGetUp();
  const down = useGetDown();
  const date = useGetDate();
  const night = useGetNight();
  const person = useGetPerson();
  const fieldsNames = useGetFieldsNames();

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

  return (
    <div className={modalIsOpen ? 'main_form open' : 'main_form'}>
      <UpField
        title={up}
        aria={'Город вылета'}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        popupName={fieldsNames.up}
      />
      <DownField
        title={down}
        aria={'Город прибытия'}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        popupName={fieldsNames.down}
      />
      <DateField
        title={date}
        aria={'Дата вылета'}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        popupName={fieldsNames.date}
      />
      <NightField
        title={`${night.from} - ${night.to} ночей`}
        aria={'Количество ночей'}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        popupName={fieldsNames.night}
      />
      <PersonField
        title={personTitle}
        aria={'Количество туристов'}
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
        popupName={fieldsNames.person}
      />
      <button className="main_form_btn">
        <FM id="common.search" />
      </button>
    </div>
  );
}
