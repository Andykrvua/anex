import { useEffect, useState } from 'react';
import { useGetModal, useSetModal } from 'store/store';
import CloseSvg from './closeSvg';
import styles from './modal.module.css';
import { modal, transitionTime } from '../../utils/constants';
import dynamic from 'next/dynamic';
import { useIntl } from 'react-intl';
import Loader from 'components/common/loader';
import useWindowSize from 'utils/getViewport';

const LeadGetTours = dynamic(
  () =>
    import(
      /* webpackChunkName: "leadGetTours" */ `./modalChildren/leadGetTours`
    ),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

const LeadRequestCall = dynamic(
  () =>
    import(
      /* webpackChunkName: "leadGetTours" */ `./modalChildren/leadRequestCall`
    ),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

const HotelCardsMap = dynamic(
  () =>
    import(
      /* webpackChunkName: "hotelCardsMap" */ `./modalChildren/hotelCardsMap`
    ),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

const OfferPageChangePerson = dynamic(
  () =>
    import(
      /* webpackChunkName: "hotelCardsMap" */ `./modalChildren/offerPageChangePerson`
    ),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

const OfferPageChangeNight = dynamic(
  () =>
    import(
      /* webpackChunkName: "hotelCardsMap" */ `./modalChildren/offerPageChangeNight`
    ),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

export default function Modal() {
  const getModal = useGetModal();
  const setModal = useSetModal();
  const intl = useIntl();
  const size = useWindowSize();
  const maxWidth = 810;

  const offersPageModalLayout =
    getModal.get === modal.offerPageChangePerson ||
    getModal.get === modal.offerPageChangeNight;

  const [isOpened, setIsOpened] = useState(false);

  const modalTitle = {
    leadGetTours: intl.formatMessage({ id: 'modal.title.leadgettours' }),
    leadRequestCall: intl.formatMessage({ id: 'modal.title.leadrequestcall' }),
  };

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

  const modal_content = offersPageModalLayout ? {} : {};
  const modal_content_mobile = offersPageModalLayout
    ? { position: 'relative', width: '100%', height: '100%', margin: 0 }
    : {};
  const modal_content_text = offersPageModalLayout
    ? {
        maxHeight: 'var(--mainform-desktop-maxheight)',
        width: '360px',
        padding: 0,
      }
    : {};
  const modal_content_text_mobile = offersPageModalLayout
    ? {
        maxHeight: '100%',
        width: '100%',
        height: '100%',
        padding: 0,
      }
    : {};

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
          <div
            className={styles.modal_content}
            style={
              size.width >= maxWidth ? modal_content : modal_content_mobile
            }
          >
            {!offersPageModalLayout && (
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
            )}
            <div
              className={styles.modal_content_text}
              style={
                size.width >= maxWidth
                  ? modal_content_text
                  : modal_content_text_mobile
              }
            >
              {getModal.get === modal.leadGetTours && (
                <LeadGetTours closeHandler={closeHandler} />
              )}
              {getModal.get === modal.leadRequestCall && (
                <LeadRequestCall closeHandler={closeHandler} />
              )}
              {getModal.get === modal.hotelCardsMap && (
                <HotelCardsMap closeHandler={closeHandler} />
              )}
              {getModal.get === modal.offerPageChangePerson && (
                <OfferPageChangePerson closeHandler={closeHandler} />
              )}
              {getModal.get === modal.offerPageChangeNight && (
                <OfferPageChangeNight closeHandler={closeHandler} />
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
