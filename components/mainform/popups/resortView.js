import { useState, useEffect } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import Loader from 'components/common/loader';
import Checkbox from 'components/controls/checkbox/checkbox';
import styles from './resortView.module.css';

export default function ResortView({ country, loc, onBack, onApply }) {
  const [resorts, setResorts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function fetchResorts() {
      setLoading(true);
      setSelected([]);
      try {
        const res = await fetch(
          `https://api.otpusk.com/api/2.6/tours/geotree?depth=city&id=${country.id}&access_token=337da-65e22-26745-a251f-77b9e&lang=${loc}&with=price`,
        );
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) {
            setResorts(data.geo || []);
          }
        }
      } catch (e) {
        /* eslint-disable-next-line */
        console.log('geotree fetch error', e);
      }
      if (!cancelled) setLoading(false);
    }

    fetchResorts();
    return () => {
      cancelled = true;
    };
  }, [country.id, loc]);

  const toggleSelect = (id) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));
  };

  const handleApply = () => {
    onApply(selected, country);
  };

  // Group resorts: provinces with children, and standalone cities go to "Інші"
  const provinces = [];
  const cities = [];

  if (resorts) {
    for (const item of resorts) {
      if (item.type === 'province' && item.children && item.children.length > 0) {
        provinces.push(item);
      } else if (item.type === 'city') {
        cities.push(item);
      }
    }
  }

  return (
    <div className={styles.resort_view}>
      <button className={styles.back_btn} onClick={onBack} type="button">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.5 15L7.5 10L12.5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span>{country.name}</span>
      </button>

      {loading && <Loader />}

      {!loading && resorts && (
        <div className={styles.resort_list}>
          {provinces.map((province) => (
            <div key={province.id} className={styles.resort_group}>
              <h5 className={styles.group_title}>{province.name}</h5>
              {province.children.map((child) => (
                <div key={child.id} className={styles.resort_item}>
                  <Checkbox
                    label={child.name}
                    check={selected.includes(child.id)}
                    setCheck={() => toggleSelect(child.id)}
                  />
                </div>
              ))}
            </div>
          ))}

          {cities.length > 0 && (
            <div className={styles.resort_group}>
              <h5 className={styles.group_title}>
                <FM id="mainform.down.resorts_other" />
              </h5>
              {cities.map((city) => (
                <div key={city.id} className={styles.resort_item}>
                  <Checkbox
                    label={city.name}
                    check={selected.includes(city.id)}
                    setCheck={() => toggleSelect(city.id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!loading && selected.length > 0 && (
        <div className="apply_btn_wrapper">
          <button className="apply_btn" onClick={handleApply} type="button">
            <FM id="common.apply" /> ({selected.length})
          </button>
        </div>
      )}
    </div>
  );
}
