import { useState, useEffect, memo, useRef } from 'react';
import styles from './subnavCountry.module.css';
import CloseSvg from '../closeSvg';
import CountryList from 'components/countryList';
import { countryListVariants } from 'utils/constants';

function useOutsideClick(ref, setIsOpen, isOpen, el) {
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    function handleClickOutside(event) {
      if (event.target.closest(el)) {
        return null;
      }
      if (
        ref.current &&
        !ref.current.contains(event.target) &&
        !event.target.closest(el) &&
        !event.target.closest('button.header_nav_link')
      ) {
        setIsOpen(false);
        document.removeEventListener('mousedown', handleClickOutside);
      }
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);
}

export default function SubnavCountry({ offsetLeft, isOpen, setIsOpen }) {
  const [offset, setOffest] = useState(null);
  const [transition, setTransition] = useState('scaleY(0)');
  useEffect(() => {
    setOffest(offsetLeft);

    return () => {
      setOffest(offsetLeft);
    };
  }, [offsetLeft]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setTransition('scaleY(1)');
      }, 0);
    }

    return () => {
      setTransition('scaleY(0)');
    };
  }, [isOpen]);

  const elRef = useRef();

  useOutsideClick(elRef, setIsOpen, isOpen, '.subnavcountry_wrapper');

  return (
    <div
      ref={elRef}
      id="countrylist"
      role="menu"
      aria-labelledby="countrylistbutton"
      className={`${styles.subnavcountry_wrapper} subnavcountry_wrapper`}
      style={{
        left: `${offset ? offset : 30}px`,
        top: offset ? '80px' : 'calc(100% - 25px)',
        transform: `${transition}`,
      }}
    >
      <div className={styles.subnavcountry}>
        <header className={styles.subnavcountry_header}>
          <button
            className="svg_btn svg_btn_stroke"
            aria-label="Закрыть"
            onClick={() => setIsOpen(false)}
          >
            <CloseSvg />
          </button>
        </header>
        <div className={styles.subnavcountry_content}>
          <CountryList variant={countryListVariants.getSearch} />
        </div>
      </div>
    </div>
  );
}
