import { useRef, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import useOutsideClick from '../../../utils/clickOutside';
import { allCountry } from '../../../utils/allCountry';
import {
  useSetBodyScroll,
  getSize,
  enableScroll,
  clear,
  disableScroll,
  maxWidth,
  BODY,
} from '../../../utils/useBodyScroll';
import Header from './header';
import { svgDown } from '../form-fields/svg';
import styles from './down.module.css';
import CountryList from 'components/countryList';
import { countryListVariants } from 'utils/constants';
import LoadingPlaceholder from '../form-fields/loadingPlaceholder';
import SimpleBar from 'simplebar-react';
import { transitionTime } from '../../../utils/constants';
import { useSetDown } from '../../../store/store';
import { FormattedMessage as FM, useIntl } from 'react-intl';

// change scroll depending on mobile or desktop
const SimpleBarWrapper = ({ size, children }) => {
  return (
    <>
      {size.width >= maxWidth ? (
        <SimpleBar
          className="mobile_default"
          style={{ maxHeight: 'var(--mainform-desktop-maxheight)' }}
          autoHide={true}
        >
          {children}
        </SimpleBar>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

// selected item confirmation block
const DownApplySelected = dynamic(
  () => import(/* webpackChunkName: "downApply" */ './downApplySelected'),
  {
    ssr: false,
    loading: () => {
      return <LoadingPlaceholder />;
    },
  }
);

export default function Down({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
}) {
  const selectDown = useSetDown();
  const selectDownHandler = (name) => {
    selectDown(name);
    setCountry(name);
    closeModalHandler();
    setTimeout(() => {
      setCountryData(false);
    }, transitionTime);
  };

  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);
  const input = useRef(null);
  const intl = useIntl();
  const placeholderTxt = intl.formatMessage({
    id: 'mainform.down.placeholder',
  });

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth, size.width);

  const [iosView, setIosView] = useState(0);
  const [country, setCountry] = useState('');
  const [countryData, setCountryData] = useState(false);

  // get viewport height when opening momile keyboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        if (!window.visualViewport) return;
        window.visualViewport.addEventListener('resize', resizeHandler);
        return () =>
          window.visualViewport.removeEventListener('resize', resizeHandler);
      }
    }
  }, []);

  function resizeHandler() {
    // ios 13+ get height when keyboard is open
    // need fix for ios > 13
    setIosView(window.visualViewport.height);
  }

  useEffect(() => {
    if (size.width < maxWidth) {
      if (modalIsOpen) {
        disableScroll(scrollable.current);
      }
    }
    return () => {
      clear();
    };
  }, [modalIsOpen, size.width]);

  const closeModalHandler = () => {
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  const inputOnchange = (e) => {
    setCountry(e.target.value);
  };

  const clickCountryItem = (e) => {
    const selected = allCountry.find(
      (item) => item.code === e.target.closest('.country_item').dataset.code
    );
    if (size.width >= maxWidth) {
      selectDownHandler(selected.name);
    } else {
      setCountry(selected.name);
      setCountryData(selected);
    }
  };

  return (
    <SimpleBarWrapper size={size}>
      <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
        <Header closeModalHandler={closeModalHandler} svg={svgDown} />
        <h3 className="title">{popupName}</h3>
        <div className={styles.down_input_wrapper}>
          <input
            ref={input}
            type="text"
            name=""
            id=""
            placeholder={placeholderTxt}
            onChange={(e) => inputOnchange(e)}
            value={country}
          />
        </div>
        <div
          className="popup_scrollable_content"
          ref={scrollable}
          style={
            iosView
              ? {
                  flex: `0 0 ${iosView - 243}px`,
                }
              : {}
          }
        >
          {iosView}
          <h5 className={styles.down_content_title}>
            <FM id="mainform.down.t2" />
          </h5>
          <CountryList
            variant={countryListVariants.getSearchPopular}
            clickCountryItem={clickCountryItem}
          />
          <h5 className={styles.down_content_title}>
            <FM id="mainform.down.t3" /> (31)
          </h5>
          <CountryList
            variant={countryListVariants.getSearch}
            clickCountryItem={clickCountryItem}
          />
        </div>
        {countryData && (
          <DownApplySelected
            item={countryData}
            setCountryData={setCountryData}
            selectDownHandler={selectDownHandler}
          />
        )}
      </div>
    </SimpleBarWrapper>
  );
}
