import { useEffect, useState } from 'react';

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
      }, 300);
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
