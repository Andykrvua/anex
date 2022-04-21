import { useEffect } from 'react';

export default function useOutsideClick(
  ref,
  setModalIsOpen,
  modalIsOpen,
  cName
) {
  useEffect(() => {
    if (modalIsOpen === cName) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    function handleClickOutside(event) {
      if (event.target.closest('.main_formfield')) {
        document.removeEventListener('mousedown', handleClickOutside);
        return null;
      }
      if (ref.current && !ref.current.contains(event.target)) {
        setModalIsOpen('');
        document.removeEventListener('mousedown', handleClickOutside);
      }
    }
    if (!modalIsOpen) {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [modalIsOpen]);
}
