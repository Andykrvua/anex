import { useEffect, useState } from 'react';
import { useGetModal, useSetModal } from 'store/store';
import CloseSvg from './closeSvg';
import styles from './modal.module.css';
import { modal, transitionTime } from '../../utils/constants';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';

const LeadGetTours = dynamic(
  () =>
    import(
      /* webpackChunkName: "leadGetTours" */ `./modalChildren/leadGetTours`
    ),
  {
    ssr: false,
  }
);

const LeadRequestCall = dynamic(
  () =>
    import(
      /* webpackChunkName: "leadGetTours" */ `./modalChildren/leadRequestCall`
    ),
  {
    ssr: false,
  }
);

export default function Modal() {
  const getModal = useGetModal();
  const setModal = useSetModal();
  const intl = useIntl();

  const [isOpened, setIsOpened] = useState(false);

  const modalTitle = {
    leadGetTours: intl.formatMessage({ id: 'modal.title.leadgettours' }),
    leadRequestCall: intl.formatMessage({ id: 'modal.title.leadrequestcall' }),
  };

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
              <h5
                className={styles.title}
                dangerouslySetInnerHTML={{
                  __html: modalTitle[getModal.get],
                }}
              ></h5>
              <button
                className="svg_btn svg_btn_stroke"
                aria-label="Закрыть"
                onClick={closeHandler}
              >
                <CloseSvg />
              </button>
            </header>
            <div className={styles.modal_content_text}>
              {getModal.get === modal.leadGetTours && (
                <LeadGetTours closeHandler={closeHandler} />
              )}
              {getModal.get === modal.leadRequestCall && (
                <LeadRequestCall closeHandler={closeHandler} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
