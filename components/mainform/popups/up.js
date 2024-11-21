import { useRef, useEffect, useState } from 'react';
import useOutsideClick from '../../../utils/clickOutside';
import SimpleBar from 'simplebar-react';
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
import { svgUp, svgBus, svgNo } from '../form-fields/svg';
import { useSetUp, useGetDown, useGetUp, useGetUpPointList, useSetUpPointList } from '../../../store/store';
import styles from './up.module.css';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import Loader from 'components/common/loader';
import { transportIcon, languagesOperatorApi } from 'utils/constants';
import { useRouter } from 'next/router';

// change scroll depending on mobile or desktop
const SimpleBarWrapper = ({ size, children }) => {
  return (
    <>
      {size.width >= maxWidth ? (
        <SimpleBar className="mobile_default main_form_open_scroll" autoHide={true}>
          {children}
        </SimpleBar>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

export default function UpWindow({ setModalIsOpen, modalIsOpen, cName, popupName, value }) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const intl = useIntl();
  const selectUp = useSetUp();
  const getDown = useGetDown();
  const { locale } = useRouter();
  const loc = languagesOperatorApi[locale];

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth, size.width);

  const getUpPointList = useGetUpPointList();
  const setUpPointList = useSetUpPointList();
  const getUp = useGetUp();

  let lastCountry = '';

  const headerTransportIcon = {
    bus: svgBus,
    air: svgUp,
    no: svgNo,
  };

  const [selectedUp, setSelectedUp] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (!getUpPointList.active) {
      setLoading(true);

      const search = await fetch(`/api/endpoints/fromcities?geoId=${getDown.value}&locale=${loc}`).then(
        (response) => {
          if (response.status === 200) {
            return response.json();
          }
          return null;
        }
      );

      if (search?.ok) {
        const data = search.result.fromCities;
        data.sort((a, b) => {
          const countryComparison = a.country.localeCompare(b.country, 'ru');
          if (countryComparison !== 0) {
            return countryComparison;
          }
          return a.name.localeCompare(b.name, 'ru');
        });
        setUpPointList({
          active: true,
          list: data,
        });
      }
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (size.width < maxWidth) {
      if (modalIsOpen) {
        disableScroll(scrollable.current);
      }

      if (scrollable.current) {
        const targetElement = scrollable.current.querySelector('[class*="input_label_content_active"]');

        if (targetElement) {
          const offsetTop = targetElement?.offsetTop;
          const targetHeight = targetElement?.offsetHeight;
          const parentHeight = scrollable.current?.clientHeight;
          scrollable.current.scrollTo({
            top: offsetTop - parentHeight + targetHeight + 20,
          });
        }
      }
    } else {
      if (scrollable.current) {
        const parentElement = scrollable.current.closest('.simplebar-content-wrapper');
        const targetElement = parentElement.querySelector('[class*="input_label_content_active"]');

        if (targetElement) {
          const offsetTop = targetElement?.offsetTop;
          const targetHeight = targetElement?.offsetHeight;
          const parentHeight = parentElement?.clientHeight;

          parentElement.scrollTo({
            top: offsetTop - parentHeight + targetHeight + 20,
          });
        }
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

  const inputHandler = (e) => {
    // if (size.width >= maxWidth) {
    selectUp({
      name: e.target.dataset.name,
      value: e.target.value,
      transport: e.target.dataset.transport ? e.target.dataset.transport : '',
    });
    setModalIsOpen('');
    // } else {
    // setSelectedUp({
    //   name: e.target.dataset.name,
    //   value: e.target.value,
    //   transport: e.target.dataset.transport ? e.target.dataset.transport : '',
    // });
    // }
  };

  // const selectedHandler = () => {
  //   if (!selectedUp.name) return;
  //   selectUp(selectedUp);
  //   if (size.width < maxWidth) {
  //     enableScroll(BODY);
  //   }
  //   setModalIsOpen('');
  // };

  return (
    <SimpleBarWrapper size={size}>
      <div className="main_form_popup_mobile_wrapper" ref={wrapperRef} style={{ overflow: 'hidden' }}>
        <Header
          closeModalHandler={closeModalHandler}
          svg={getUp.transport ? headerTransportIcon[getUp.transport] : headerTransportIcon.no}
        />
        <h3 className="title">{popupName}</h3>
        <div className={`${styles.popup_scrollable_content} popup_scrollable_content`} ref={scrollable}>
          {loading && <Loader />}
          {!loading && (
            <div className={styles.input_wrapper}>
              <label className={styles.input_label}>
                <input
                  className={styles.input}
                  type="radio"
                  name="up"
                  id="no_transport"
                  onChange={(e) => inputHandler(e)}
                  value=""
                  data-name={intl.formatMessage({
                    id: 'mainform.up.no_tr',
                  })}
                />
                <span
                  className={
                    !getUp.value
                      ? `${styles.input_label_content} ${styles.input_label_content_active}`
                      : `${styles.input_label_content}`
                  }
                >
                  <span className={styles.input_label_text}>
                    {intl.formatMessage({
                      id: 'mainform.up.no_tr',
                    })}
                  </span>
                  <span className={styles.input_label_icons}>
                    <img src={`/assets/img/svg/up/suitcase.svg`} alt="" />
                  </span>
                </span>
              </label>
              {getUpPointList.active &&
                getUpPointList.list.map((item, i) => {
                  const showCountryHeader = lastCountry !== item.country;
                  lastCountry = item.country;
                  return (
                    <div key={i}>
                      {showCountryHeader && <p className={styles.input_block_header}>{item.country}</p>}
                      <label className={styles.input_label}>
                        <input
                          className={styles.input}
                          type="radio"
                          name="up"
                          id={i}
                          onChange={(e) => inputHandler(e)}
                          value={item.id}
                          defaultChecked={item.id === value.toString()}
                          data-name={item.name}
                          data-transport={item.transport[0]}
                        />
                        <span
                          className={
                            getUp.value == item.id
                              ? `${styles.input_label_content} ${styles.input_label_content_active}`
                              : `${styles.input_label_content}`
                          }
                        >
                          <span className={styles.input_label_text}>{item.name}</span>
                          <span className={styles.input_label_icons}>
                            <img
                              src={`/assets/img/svg/up/${
                                transportIcon[item.transport[0]]
                                // transportIcon[item.transport.map((tr) => tr)]
                              }`}
                              alt=""
                            />
                          </span>
                        </span>
                      </label>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </SimpleBarWrapper>
  );
}
