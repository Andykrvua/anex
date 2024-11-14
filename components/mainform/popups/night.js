import SimpleBar from 'simplebar-react';
import { useRef, useEffect, useState } from 'react';
import useOutsideClick from '../../../utils/clickOutside';
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
import { svgNight } from '../form-fields/svg';
import styles from './night.module.css';
import { useGetNight, useSetNight } from '../../../store/store';
import { FormattedMessage as FM } from 'react-intl';
import declension from 'utils/declension';
import { useIntl } from 'react-intl';

// change scroll depending on mobile or desktop
const SimpleBarWrapper = ({ size, children }) => {
  return (
    <>
      {size.width >= maxWidth ? (
        <SimpleBar
          className="mobile_default"
          // style={{ maxHeight: 'var(--mainform-desktop-maxheight)' }}
          style={{ height: 'var(--mainform-desktop-maxheight)' }}
          // style={{ height: 'min(calc(100vh - 313px), var(--mainform-desktop-maxheight)' }}
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

export default function Night({ setModalIsOpen, modalIsOpen, cName, popupName }) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const defaultNight = useGetNight();
  const selectedNight = useSetNight();

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth, size.width);

  const [fromNight, setFromNight] = useState(Number(defaultNight.from));
  const [toNight, setToNight] = useState(Number(defaultNight.to));

  useEffect(() => {
    if (size.width < maxWidth) {
      if (modalIsOpen) {
        disableScroll(scrollable.current);
      }

      if (scrollable.current) {
        const targetElement = scrollable.current.querySelector('[class*="night_handler_btn_active"]');

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
        const targetElement = parentElement.querySelector('[class*="night_handler_btn_active"]');

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

  const selectedHandler = (from, to) => {
    setFromNight(from);
    setToNight(to);
    const newNight = { from, to };
    selectedNight(newNight);
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  const generateDurationEnumList = (start, end) => {
    const durationEnumList = [];

    for (let i = start; i <= end; i++) {
      const obj = {
        args: [i, i + 2],
        txt: `${i + 1}-${i + 3}`,
      };
      durationEnumList.push(obj);
    }

    return durationEnumList;
  };

  const durationEnum = generateDurationEnumList(1, 26);

  const intl = useIntl();

  const night1 = intl.formatMessage({
    id: 'common.night1',
  });
  const night2 = intl.formatMessage({
    id: 'common.night2',
  });
  const night5 = intl.formatMessage({
    id: 'common.night5',
  });
  const day1 = intl.formatMessage({
    id: 'common.day1',
  });
  const day2 = intl.formatMessage({
    id: 'common.day2',
  });
  const day5 = intl.formatMessage({
    id: 'common.day5',
  });

  return (
    <SimpleBarWrapper size={size}>
      <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
        <Header closeModalHandler={closeModalHandler} svg={svgNight} />
        <h3 className="title">{popupName}</h3>
        <div className={`${styles.popup_scrollable_content} popup_scrollable_content`} ref={scrollable}>
          {durationEnum.map((dur) => {
            return (
              <button
                key={dur.txt}
                onClick={() => selectedHandler(dur.args[0], dur.args[1])}
                className={
                  dur.args[0] === fromNight && dur.args[1] === toNight
                    ? `${styles.night_handler_btn} ${styles.night_handler_btn_active}`
                    : `${styles.night_handler_btn}`
                }
              >
                {`${dur.args[0]}-${dur.args[1]} `}
                {declension(dur.args[1], night1, night2, night5)}
                <span>
                  , {`${dur.txt} `}
                  {declension(dur.args[1], day1, day2, day5)}
                </span>
              </button>
            );
          })}
        </div>
        {/* <div className={`apply_btn_wrapper ${styles.apply_btn_wrapper_night}`}>
          <button className="apply_btn" onClick={selectedHandler}>
            <FM id="common.apply" />
          </button>
        </div> */}
      </div>
    </SimpleBarWrapper>
  );
}
