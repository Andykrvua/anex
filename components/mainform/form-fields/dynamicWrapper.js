import { useEffect, useState } from 'react';
import { transitionTime } from '../../../utils/constants';

export default function DynamicWrapper({ modalIsOpen, cName, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenHelper, setIsOpenHelper] = useState(false);

  useEffect(() => {
    // need for close animation
    if (cName === modalIsOpen) {
      setIsOpen(modalIsOpen);
      setIsOpenHelper(modalIsOpen);
    } else {
      setTimeout(() => {
        setIsOpenHelper(modalIsOpen);
      }, transitionTime);
    }
  }, [modalIsOpen]);

  return (
    <div
      className={
        isOpenHelper === cName ? 'main_form_popup open' : 'main_form_popup'
      }
    >
      {isOpen === cName && <div className="popup_wrapper">{children}</div>}
    </div>
  );
}
