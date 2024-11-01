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
  useGetFieldsNames,
} from '../../store/store';
import { useRouter } from 'next/router';
import SearchButton from './SearchButton';

export default function MainForm() {
  const [modalIsOpen, setModalIsOpen] = useState('');
  const router = useRouter();

  const up = useGetUp();
  const down = useGetDown();
  const date = useGetDate();
  const night = useGetNight();
  const fieldsNames = useGetFieldsNames();

  const MemoUpField = memo(UpField);
  const MemoDownField = memo(DownField);
  const MemoDateField = memo(DateField);
  const MemoNightField = memo(NightField);
  const MemoPersonField = memo(PersonField);

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
        modalIsOpen={modalIsOpen}
        setModalIsOpen={setModalIsOpen}
      />

      <SearchButton />
    </div>
  );
}
