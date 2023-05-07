import styles from './leadRequestCall.module.css';
import { useState } from 'react';
import { useSetWindowInfo } from '/store/store';
import { infoModal } from '/utils/constants';
import { createLeadRequestCall } from 'utils/nextFetch';
import { useIntl } from 'react-intl';
import Checkbox from 'components/controls/checkbox/checkbox';
import MessendgersLinks from 'components/common/other/messendgersLinks';

export default function LeadRequestCall({ closeHandler }) {
  const intl = useIntl();
  const setModalInfo = useSetWindowInfo();

  const [phone, setPhone] = useState('');
  const [check, setCheck] = useState(false);
  const [loading, setLoading] = useState(false);

  const phone_numbers = [
    { phone_text: '+38 044 338 41 44', phone_number: '+380443384144' },
    { phone_text: '+38 066 591 41 44', phone_number: '+380665914144' },
    { phone_text: '+38 096 591 41 44', phone_number: '+380965914144' },
    { phone_text: '+38 063 591 41 44', phone_number: '+380635914144' },
  ];

  const submitHandler = async (e) => {
    e.preventDefault();

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

    setLoading(true);
    const res = await createLeadRequestCall({
      phone,
      url: window.location.href,
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
        setPhone('');
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

  return (
    <div className={styles.requestcall}>
      <p className={styles.descr}>{intl.formatMessage({ id: 'vs_discl' })}<br/>{intl.formatMessage({ id: 'vs_discl2' })}</p>
      <div className={styles.messendgers}>
        <MessendgersLinks />
      </div>
      <div className={styles.phones}>
        {phone_numbers.map((item, index) => (
          <a
            key={index}
            className={styles.phone}
            href={`tel:${item.phone_number}`}
          >
            {item.phone_text}
          </a>
        ))}
      </div>
      <div className={styles.schedule}>
        <h6>{intl.formatMessage({ id: 'modal.leadrequestcall.schedule' })}</h6>
        <p>Пн - Пт: 11:00 – 19:00</p>
        <p>Сб: 11:00 – 17:00</p>
      </div>
      <h5 className={styles.title}>
        {intl.formatMessage({ id: 'modal.subtitle.leadrequestcall' })}
      </h5>
      <form
        className={
          loading ? `${styles.form} ${styles.loading}` : `${styles.form}`
        }
        onSubmit={submitHandler}
      >
        <input
          type="text"
          placeholder={intl.formatMessage({ id: 'certificates.inp.phone.p' })}
          onChange={(e) => setPhone(e.target.value)}
          value={phone}
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
    </div>
  );
}
