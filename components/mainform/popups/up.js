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
import { svgUp } from '../form-fields/svg';
import {
  useSetUp,
  useGetDown,
  useGetUpPointList,
  useSetUpPointList,
} from '../../../store/store';
import styles from './up.module.css';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import Loader from 'components/common/loader';
import { transportIcon } from 'utils/constants';

// change scroll depending on mobile or desktop
const SimpleBarWrapper = ({ size, children }) => {
  return (
    <>
      {size.width >= maxWidth ? (
        <SimpleBar
          className="mobile_default"
          // style={{ maxHeight: 'var(--mainform-desktop-maxheight)' }}
          style={{ height: 'var(--mainform-desktop-maxheight)' }}
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

export default function UpWindow({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
  value,
}) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const intl = useIntl();
  const selectUp = useSetUp();
  const getDown = useGetDown();

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth, size.width);

  const getUpPointList = useGetUpPointList();
  const setUpPointList = useSetUpPointList();

  const [selectedUp, setSelectedUp] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(async () => {
    if (!getUpPointList.active) {
      setLoading(true);

      const search = await fetch(
        `/api/endpoints/fromcities?geoId=${getDown.value}`
      ).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      });

      if (search?.ok) {
        setUpPointList({
          active: true,
          list: search.result.fromCities,
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
    if (size.width >= maxWidth) {
      console.log('e.target', e.target);
      selectUp({
        name: e.target.dataset.name,
        value: e.target.value,
        transport: e.target.dataset.transport ? e.target.dataset.transport : '',
      });
      setModalIsOpen('');
    } else {
      setSelectedUp({
        name: e.target.dataset.name,
        value: e.target.value,
        transport: e.target.dataset.transport ? e.target.dataset.transport : '',
      });
    }
  };

  const selectedHandler = () => {
    selectUp(selectedUp);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  return (
    <SimpleBarWrapper size={size}>
      <div
        className="main_form_popup_mobile_wrapper"
        ref={wrapperRef}
        style={{ overflow: 'hidden' }}
      >
        <Header closeModalHandler={closeModalHandler} svg={svgUp} />
        <h3 className="title">{popupName}</h3>
        <div
          className={`${styles.popup_scrollable_content} popup_scrollable_content`}
          ref={scrollable}
          // style={{ justifyContent: contentStyle ? 'center' : 'start' }}
        >
          {loading && <Loader />}
          {!loading && (
            <div className={styles.input_wrapper}>
              {getUpPointList.active &&
                getUpPointList.list.map((item, i) => {
                  console.log('item', item);
                  return (
                    <label className={styles.input_label} key={i}>
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
                      <span className={styles.input_label_content}>
                        <span className={styles.input_label_text}>
                          {item.name}
                        </span>
                        <span className={styles.input_label_icons}>
                          <img
                            src={`/assets/img/svg/up/${
                              transportIcon[item.transport.map((tr) => tr)]
                            }`}
                            alt=""
                          />
                        </span>
                      </span>
                    </label>
                  );
                })}
              <label className={styles.input_label}>
                <input
                  className={styles.input}
                  type="radio"
                  name="up"
                  id="no_transport"
                  onChange={(e) => inputHandler(e)}
                  value="9999"
                  data-name={intl.formatMessage({
                    id: 'mainform.up.no_tr',
                  })}
                />
                <span className={styles.input_label_content}>
                  <span className={styles.input_label_text}>
                    {intl.formatMessage({
                      id: 'mainform.up.no_tr',
                    })}
                  </span>
                  <span className={styles.input_label_icons}>
                    <img src={`/assets/img/svg/up/smile.svg`} alt="" />
                  </span>
                </span>
              </label>
            </div>
          )}
        </div>
        {size.width < maxWidth && (
          <div className="apply_btn_wrapper">
            <button className="apply_btn" onClick={selectedHandler}>
              <FM id="common.apply" />
            </button>
          </div>
        )}
      </div>
    </SimpleBarWrapper>
  );
}
