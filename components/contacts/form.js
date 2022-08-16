import styles from './form.module.css';
import { useState } from 'react';
import { useSetWindowInfo } from '/store/store';
import { infoModal } from '/utils/constants';
import { createLead } from 'utils/nextFetch';
import { useIntl } from 'react-intl';
import Checkbox from 'components/common/checkbox/checkbox';

export default function Form() {
  const intl = useIntl();
  const setModalInfo = useSetWindowInfo();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [text, setText] = useState('');
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);

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

    if (text.length < 10) {
      const data = {
        show: true,
        type: infoModal.error,
        text: intl.formatMessage({ id: 'contacts.form.modal.text' }),
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
    const res = await createLead({
      name,
      phone,
      text,
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
        placeholder={intl.formatMessage({ id: 'contacts.inp.text.p' })}
        onChange={(e) => setText(e.target.value)}
        value={text}
        disabled={loading}
      />
      <Checkbox
        label={intl.formatMessage({ id: 'contacts.form.checkbox' })}
        check={check}
        setCheck={setCheck}
      />

      <button className={`${styles.btn} apply_btn`} disabled={loading}>
        {loading
          ? intl.formatMessage({ id: 'certificates.form.btn.loading' })
          : intl.formatMessage({ id: 'contacts.form.btn' })}
      </button>
    </form>
  );
}
