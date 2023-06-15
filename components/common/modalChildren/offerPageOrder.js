import { useRef, useEffect, useState } from 'react';
import useOutsideClick from 'utils/clickOutside';
import {
  useSetBodyScroll,
  getSize,
  clear,
  disableScroll,
  maxWidth,
} from 'utils/useBodyScroll';
import Header from 'components/mainform/popups/header';
import { svgNight } from 'components/mainform/form-fields/svg';
import styles from './offerPageOrder.module.css';
import { useSetWindowInfo, useGetCurrentOffer } from 'store/store';
import { FormattedMessage as FM } from 'react-intl';
import { infoModal } from '/utils/constants';
import { createLeadOrderTour } from 'utils/nextFetch';
import { useIntl } from 'react-intl';
import Checkbox from 'components/controls/checkbox/checkbox';
import { links } from 'utils/links';
import { validateEmail } from 'utils/validators';

export default function SendOrder({ closeHandler }) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const mainPhone = '+38 063 591 41 44';

  const intl = useIntl();
  const setModalInfo = useSetWindowInfo();
  const getCurrentOffer = useGetCurrentOffer();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitHandler = async () => {
    if (name.length < 2) {
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'certificates.form.modal.name' }),
      };
      setModalInfo(data);
      return;
    }

    let phoneTrim = phone.replaceAll('+38', '');
    phoneTrim = phoneTrim.replaceAll('+ 38', '');
    phoneTrim = phoneTrim.replaceAll(' ', '');
    phoneTrim = phoneTrim.replaceAll('(', '');
    phoneTrim = phoneTrim.replaceAll(')', '');
    phoneTrim = phoneTrim.replaceAll('+', '');
    phoneTrim = phoneTrim.replaceAll('-', '');

    if (phoneTrim.length < 10 || phoneTrim.length > 10) {
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'certificates.form.modal.phone' }),
      };
      setModalInfo(data);
      return;
    }

    if (!validateEmail(email)) {
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'form.invalid.email' }),
      };
      setModalInfo(data);
      return;
    }

    if (!check) {
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'contacts.form.checkbox' }),
      };
      setModalInfo(data);
      return;
    }

    setLoading(true);
    const res = await createLeadOrderTour({
      name,
      phone,
      email,
      url: window.location.href,
      order_link: getCurrentOffer.bron,
      order: getCurrentOffer,
    });

    if (res.ok) {
      setTimeout(() => {
        setLoading(false);
        const data = {
          show: true,
          type: infoModal.ok,
          text: intl.formatMessage({ id: 'certificates.form.send.ok' }),
        };
        setModalInfo(data);
        setName('');
        setPhone('');
        setEmail('');
        closeHandler();
      }, 2000);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'certificates.form.send.fail' }),
      };
      setModalInfo(data);
    }, 2000);
  };

  useOutsideClick(wrapperRef);
  useSetBodyScroll(maxWidth, size.width);

  useEffect(() => {
    if (size.width < maxWidth) {
      disableScroll(scrollable.current);
    }
    return () => {
      clear();
    };
  }, [size.width]);

  const copyHandler = () => {
    navigator.clipboard.writeText(mainPhone);
    const val = {
      show: true,
      type: infoModal.info,
      text: intl.formatMessage({
        id: 'offer_page.btn_copy',
      }),
    };
    setModalInfo(val);
  };

  return (
    <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
      <Header closeModalHandler={closeHandler} svg={svgNight} />
      <h3 className="title">
        <FM id="modal.title.offerpageorder" />
      </h3>
      <div
        className={`${styles.popup_scrollable_content} popup_scrollable_content`}
        ref={scrollable}
      >
        <p>
          <FM id="modal.offerpageorder" />
        </p>
        <button className={styles.btn_copy} onClick={copyHandler}>
          {mainPhone}
          <svg
            width="15"
            height="14"
            viewBox="0 0 15 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5.16667 2.33317V9.33317C5.16667 9.64259 5.28958 9.93934 5.50838 10.1581C5.72717 10.3769 6.02391 10.4998 6.33333 10.4998H11C11.3094 10.4998 11.6062 10.3769 11.825 10.1581C12.0437 9.93934 12.1667 9.64259 12.1667 9.33317V4.22434C12.1666 4.06891 12.1356 3.91506 12.0753 3.77181C12.015 3.62857 11.9266 3.49881 11.8155 3.39017L9.88175 1.499C9.66379 1.28589 9.37108 1.16654 9.06625 1.1665H6.33333C6.02391 1.1665 5.72717 1.28942 5.50838 1.50821C5.28958 1.72701 5.16667 2.02375 5.16667 2.33317V2.33317Z"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M9.83333 10.4997V11.6663C9.83333 11.9758 9.71042 12.2725 9.49162 12.4913C9.27283 12.7101 8.97609 12.833 8.66667 12.833H4C3.69058 12.833 3.39383 12.7101 3.17504 12.4913C2.95625 12.2725 2.83333 11.9758 2.83333 11.6663V5.24967C2.83333 4.94026 2.95625 4.64351 3.17504 4.42472C3.39383 4.20592 3.69058 4.08301 4 4.08301H5.16667"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className={styles.messendgers}>
          <a className={styles.messendgerslinks} href={links.telegram}>
            <img
              src="/assets/img/svg/telegram.svg"
              alt="Telegram"
              width="37"
              height="37"
            />
            <FM id="modal.offerpageorder.m1" />
          </a>
          <a className={styles.messendgerslinks} href={links.viber}>
            <img
              src="/assets/img/svg/viber.svg"
              alt="Viber"
              width="37"
              height="37"
            />
            <FM id="modal.offerpageorder.m2" />
          </a>
        </div>
        <form
          className={
            loading ? `${styles.form} ${styles.loading}` : `${styles.form}`
          }
        >
          <input
            type="text"
            placeholder={intl.formatMessage({ id: 'certificates.inp.name.p' })}
            onChange={(e) => setName(e.target.value)}
            value={name}
            disabled={loading}
          />
          <input
            type="text"
            placeholder={intl.formatMessage({ id: 'certificates.inp.phone.p' })}
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            disabled={loading}
          />
          <input
            type="text"
            placeholder={intl.formatMessage({
              id: 'modal.offerpageorder.inp.email.p',
            })}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={loading}
          />
          <Checkbox
            label={intl.formatMessage({ id: 'contacts.form.checkbox' })}
            check={check}
            setCheck={setCheck}
          />
        </form>
      </div>
      <div className="apply_btn_wrapper">
        <button
          className="apply_btn"
          disabled={loading}
          onClick={submitHandler}
        >
          {loading
            ? intl.formatMessage({ id: 'certificates.form.btn.loading' })
            : intl.formatMessage({ id: 'contacts.form.btn' })}
        </button>
      </div>
    </div>
  );
}
