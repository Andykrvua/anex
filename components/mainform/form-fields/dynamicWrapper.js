import { useEffect, useState } from 'react';
import { transitionTime } from '../../../utils/constants';

export default function DynamicWrapper({ modalIsOpen, cName, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenHelper, setIsOpenHelper] = useState(false);
  const [destroy, setDestroy] = useState(true);

  const unmountTime = transitionTime * 2;

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
    return () => {
      setIsOpenHelper(modalIsOpen);
    };
  }, [modalIsOpen]);

  function Unmount() {
    if (!modalIsOpen) {
      setDestroy(false);
    }
  }

  useEffect(() => {
    // unmount component
    if (!modalIsOpen) {
      setTimeout(() => {
        Unmount();
      }, unmountTime);
    } else {
      setDestroy(true);
    }
    return () => {
      setDestroy(true);
    };
  }, [modalIsOpen]);

  return (
    <div
      className={
        isOpenHelper === cName ? 'main_form_popup open' : 'main_form_popup'
      }
    >
      {isOpen === cName && (
        <div className="popup_wrapper">{destroy && children}</div>
      )}
    </div>
  );
}
