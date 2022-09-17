import { useEffect, useState } from 'react';
import { useGetModal, useSetModal } from 'store/store';
import CloseSvg from './closeSvg';
import styles from './modal.module.css';
import { transitionTime } from '../../utils/constants';

export default function Modal() {
  const getModal = useGetModal();
  const setModal = useSetModal();
  console.log(getModal);

  const [isOpened, setIsOpened] = useState(false);

  // useEffect(() => {
  //   if (getModal) {
  //     window.addEventListener('scroll', closeHandler);
  //   }
  //   return () => {
  //     window.removeEventListener('scroll', closeHandler);
  //   };
  // }, [getModal]);

  useEffect(() => {
    // need for animation
    if (getModal) {
      setTimeout(() => {
        setIsOpened(true);
      }, transitionTime);
    }
  }, [getModal]);

  function closeEventHandler(e) {
    if (e.target.classList?.contains('modal')) {
      setIsOpened(false);
      setTimeout(() => {
        setModal(false);
      }, transitionTime);
    }
  }

  function closeHandler() {
    setIsOpened(false);
    setTimeout(() => {
      setModal(false);
    }, transitionTime);
  }

  return (
    <>
      {getModal && (
        <div
          className={
            isOpened
              ? `${styles.modal} ${styles.open} modal`
              : `${styles.modal} modal`
          }
          onClick={(e) => closeEventHandler(e)}
        >
          <div className={styles.modal_content}>
            <header className={styles.modal_content_header}>
              <button
                className="svg_btn svg_btn_stroke"
                aria-label="Закрыть"
                onClick={closeHandler}
              >
                <CloseSvg />
              </button>
            </header>
            <div className={styles.modal_content_text}>getModal</div>
          </div>
        </div>
      )}
    </>
  );
}
