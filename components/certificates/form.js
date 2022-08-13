import styles from './form.module.css';
import { useState, useEffect } from 'react';
import { useSetWindowInfo } from '/store/store';
import { infoModal } from '/utils/constants';
import { createCertificateOrder } from 'utils/nextFetch';
import { useIntl } from 'react-intl';

export default function Form({ costChecked, setCostChecked }) {
  const intl = useIntl();
  const setModalInfo = useSetWindowInfo();

  const [customCost, setCustomCost] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (costChecked) {
      setCustomCost(costChecked);
    }
  }, [costChecked]);

  const costHandler = (e) => {
    setCustomCost(e.target.value);
    setCostChecked(null);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!Number(costChecked)) {
      if (!Number(customCost) || customCost === '') {
        const data = {
          show: true,
          type: infoModal.error,
          text: intl.formatMessage({
            id: 'certificates.form.modal.cost.empty',
          }),
        };
        setModalInfo(data);
        return;
      }
      if (customCost < 5000) {
        const data = {
          show: true,
          type: infoModal.error,
          text: intl.formatMessage({ id: 'certificates.form.modal.cost.less' }),
        };
        setModalInfo(data);
        return;
      }
    }

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

    setLoading(true);
    const res = await createCertificateOrder({
      name,
      phone,
      cost: customCost,
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
        setCustomCost('');
        setName('');
        setPhone('');
        setCostChecked(null);
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
      <div className={styles.first_input}>
        <img src="/assets/img/certificates/gift-box.png" alt="" />
        <input
          type="text"
          placeholder={intl.formatMessage({ id: 'certificates.inp.cost.p' })}
          onChange={(e) => costHandler(e)}
          value={customCost}
          disabled={loading}
        />
      </div>
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
      <button className={`${styles.btn} main_form_btn`} disabled={loading}>
        {loading
          ? intl.formatMessage({ id: 'certificates.form.btn.loading' })
          : intl.formatMessage({ id: 'certificates.form.btn' })}
      </button>
    </form>
  );
}
