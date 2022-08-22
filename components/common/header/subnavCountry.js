import { useState, useEffect, useRef } from 'react';
import styles from './subnavCountry.module.css';
import CloseSvg from '../closeSvg';
import CountryList from 'components/countryList';
import { countryListVariants } from 'utils/constants';
import SimpleBar from 'simplebar-react';
import { lock, unlock } from 'tua-body-scroll-lock';

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

export default function SubnavCountry({
  offsetLeft,
  isOpen,
  setIsOpen,
  navData,
  windowSize,
}) {
  const [offset, setOffest] = useState(null);
  const [transition, setTransition] = useState('scaleY(0)');
  const [width, setWidth] = useState(null);
  const elRef = useRef();

  const scrollableRef = useRef(null);

  useEffect(() => {
    setOffest(offsetLeft);

    return () => {
      setOffest(offsetLeft);
    };
  }, [offsetLeft]);

  useEffect(() => {
    if (isOpen) {
      setWidth(windowSize.width);
      setTimeout(() => {
        setTransition('scaleY(1)');
      }, 0);
      if (windowSize.width < 810) {
        lock(scrollableRef.current);
      } else {
        unlock(document.querySelector('body'));
      }
    } else {
      unlock(document.querySelector('body'));
    }

    return () => {
      setTransition('scaleY(0)');
    };
  }, [isOpen]);

  useEffect(() => {
    setWidth(windowSize.width);
    if (isOpen) {
      if (windowSize.width < 810) {
        lock(scrollableRef.current);
      } else {
        unlock(document.querySelector('body'));
      }
    }
  }, [windowSize]);

  useOutsideClick(elRef, setIsOpen, isOpen, '.subnavcountry_wrapper');

  return (
    <div
      ref={elRef}
      id="countrylist"
      role="menu"
      aria-labelledby="countrylistbutton"
      className={
        isOpen
          ? `${styles.subnavcountry_wrapper} ${styles.open} subnavcountry_wrapper`
          : `${styles.subnavcountry_wrapper} subnavcountry_wrapper`
      }
      style={{
        left: `${offset ? offset : 30}px`,
        top: offset ? '80px' : 'calc(100% - 25px)',
        transform: `${transition}`,
        display: `${isOpen ? 'block' : 'none'}`,
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
        <div className={styles.subnavcountry_content} ref={scrollableRef}>
          {width >= 810 ? (
            <SimpleBar
              style={{ maxHeight: '610px', padding: '20px' }}
              autoHide={true}
              className="mobile_default"
            >
              <CountryList
                variant={countryListVariants.getNavMenu}
                data={navData}
                setIsOpen={setIsOpen}
              />
            </SimpleBar>
          ) : (
            <CountryList
              variant={countryListVariants.getNavMenu}
              data={navData}
              setIsOpen={setIsOpen}
            />
          )}
        </div>
      </div>
    </div>
  );
}
