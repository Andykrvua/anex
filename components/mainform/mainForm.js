import UpField from './form-fields/upField';
import DownField from './form-fields/downField';
import DateField from './form-fields/dateField';
import NightField from './form-fields/nightField';
import PersonField from './form-fields/personField';
import { useState } from 'react';
import {
  getUp,
  getDown,
  getDate,
  getNight,
  getPerson,
  getFieldsNames,
} from '../../store/store';
import declension from 'utils/declension';

export default function MainForm() {
  const [modalIsOpen, setModalIsOpen] = useState('');

  const up = getUp();
  const down = getDown();
  const date = getDate();
  const night = getNight();
  const person = getPerson();
  const fieldsNames = getFieldsNames();

  const sumPerson = person.adult + person.child;
  const declensionPerson = declension(
    sumPerson,
    'турист',
    'туриста',
    'туристов'
  );
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
      <button className="main_form_btn">Поиск</button>
    </div>
  );
}
