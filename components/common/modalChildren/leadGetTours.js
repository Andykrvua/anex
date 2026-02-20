import styles from './leadGetTours.module.css';
import { useState, useRef } from 'react';
import { useSetWindowInfo, useGetStaticData } from '/store/store';
import { infoModal } from '/utils/constants';
import { createLeadPickTour } from 'utils/nextFetch';
import { useIntl } from 'react-intl';
import Checkbox from 'components/controls/checkbox/checkbox';
import TurnstileWidget from 'components/common/TurnstileWidget/TurnstileWidget';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export default function LeadGetTours({ closeHandler }) {
  const intl = useIntl();
  const setModalInfo = useSetWindowInfo();
  const staticData = useGetStaticData();
  const turnstileResetRef = useRef(null);
  const captchaEnabled = staticData?.captcha_enabled !== false;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [text, setText] = useState('');
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');

  const submitHandler = async (e) => {
    e.preventDefault();

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

    if (!check) {
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'contacts.form.checkbox' }),
      };
      setModalInfo(data);
      return;
    }

    if (captchaEnabled && TURNSTILE_SITE_KEY && !captchaToken) {
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'certificates.form.modal.captcha' }),
      };
      setModalInfo(data);
      return;
    }

    setLoading(true);
    const res = await createLeadPickTour({
      name,
      phone,
      text,
      url: window.location.href,
      ...(captchaEnabled && TURNSTILE_SITE_KEY && captchaToken && { captchaToken }),
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
        setText('');
        closeHandler();
      }, 2000);
      return;
    }

    setTimeout(() => {
      setLoading(false);
      setCaptchaToken('');
      turnstileResetRef.current?.();
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'certificates.form.send.fail' }),
      };
      setModalInfo(data);
    }, 2000);
  };
  
  return (
    <form
      className={
        loading ? `${styles.form} ${styles.loading}` : `${styles.form}`
      }
      onSubmit={submitHandler}
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
      <textarea
        type="text"
        placeholder={intl.formatMessage({
          id: 'modal.leadgettours.inp.text.p',
        })}
        onChange={(e) => setText(e.target.value)}
        value={text}
        disabled={loading}
      />
      <Checkbox
        label={intl.formatMessage({ id: 'contacts.form.checkbox' })}
        check={check}
        setCheck={setCheck}
      />

      {captchaEnabled && TURNSTILE_SITE_KEY && (
        <div className={styles.captchaWrapper}>
          <TurnstileWidget
            siteKey={TURNSTILE_SITE_KEY}
            onSuccess={(token) => setCaptchaToken(token)}
            onExpired={() => setCaptchaToken('')}
            onReady={({ reset }) => {
              turnstileResetRef.current = reset;
            }}
            theme="light"
            size="normal"
          />
        </div>
      )}

      <button className={`${styles.btn} apply_btn`} disabled={loading}>
        {loading
          ? intl.formatMessage({ id: 'certificates.form.btn.loading' })
          : intl.formatMessage({ id: 'contacts.form.btn' })}
      </button>
    </form>
  );
}
