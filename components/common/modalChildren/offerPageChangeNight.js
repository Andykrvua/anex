import SimpleBar from 'simplebar-react';
import declension from 'utils/declension';
import { useIntl } from 'react-intl';
import { useRef, useEffect, useState } from 'react';
import useOutsideClick from 'utils/clickOutside';
import {
  useSetBodyScroll,
  getSize,
  enableScroll,
  clear,
  disableScroll,
  maxWidth,
  BODY,
} from 'utils/useBodyScroll';
import Header from 'components/mainform/popups/header';
import { svgNight } from 'components/mainform/form-fields/svg';
import styles from 'components/mainform/popups/night.module.css';
import { useGetOfferParams } from 'store/store';
import Loader from 'components/common/loader';
import { FormattedMessage as FM } from 'react-intl';
import { useRouter } from 'next/router';

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

export default function Night({ closeHandler }) {
  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);

  const getOfferParams = useGetOfferParams();

  const router = useRouter();

  useOutsideClick(wrapperRef);
  useSetBodyScroll(maxWidth, size.width);

  const [loading, setLoading] = useState(false);
  const [resMessage, setResMessage] = useState('');

  const [fromNight, setFromNight] = useState(Number(getOfferParams.nights));
  const [toNight, setToNight] = useState(Number(getOfferParams.nightsTo));

  useEffect(() => {
    if (size.width < maxWidth) {
      disableScroll(scrollable.current);
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
  }, [size.width]);

  const checkVariants = async (newNight) => {
    setLoading(true);

    const postData = {
      from: getOfferParams.from,
      to: getOfferParams.hotelId,
      transport: getOfferParams.transport,
      checkIn: getOfferParams.checkIn,
      checkTo: getOfferParams.checkTo,
      nights: newNight.from,
      nightsTo: newNight.to,
      people: getOfferParams.people,
    };

    const search = await fetch(`/api/endpoints/isOfferSearchVariants/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(postData),
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    });

    if (search?.ok) {
      setLoading(false);
      if (search.data.total) {
        ResultHandler(search.data.results, newNight);
      } else {
        setResMessage(
          'В этом отеле нет предложений с такой длительностью. Попробуйте выбрать другую дату/длительность'
        );
      }
    } else {
      setLoading(false);
      /* eslint-disable-next-line */
      console.log('api bad res');
    }
  };

  const ResultHandler = (apiData, newNight) => {
    const resultData = [];

    const { dateStart, food, offer } = getOfferParams;

    // parse api res from create array and find the same food, daystart, night count
    Object.entries(apiData).forEach(([operatorId, value]) => {
      Object.entries(value).forEach(([hotelId, data]) => {
        Object.entries(data.offers).forEach(([offerId, offerValue]) => {
          if (offerValue.fn === food && offerValue.d === dateStart && offerValue.i !== offer) {
            resultData.push(offerValue);
          }
        });
      });
    });

    // find the same food and sort min price
    const sortedData = resultData.sort((a, b) => a.pl - b.pl);
    if (sortedData.length) {
      changeOffer(sortedData[0], newNight);
    } else {
      setResMessage(
        'В этом отеле нет предложений с вашими параметрами для такой длительности. Попробуйте выбрать другую дату или изменить параметры питания'
      );
    }
  };

  const changeOffer = (offer, newNight) => {
    const locale = router.locale === 'ru' ? '' : `/${router.locale}`;
    // const nights = { from: fromNight, to: toNight };
    const nights = newNight;

    const newUrl = `${locale}/hotels/${getOfferParams.country}/${getOfferParams.hotel}/?offer=${offer.i}&transport=${offer.t}&from=${getOfferParams.from}&fromname=${getOfferParams.fromname}&to=${getOfferParams.to}&checkIn=${getOfferParams.checkIn}&checkTo=${getOfferParams.checkTo}&nights=${nights.from}&nightsTo=${nights.to}&people=${getOfferParams.people}`;
    const newAs = newUrl;

    window.history.pushState({ ...window.history.state, as: newAs, url: newUrl }, '', newAs);
    closeHandler();
    router.reload();
  };

  const selectedHandler = (from, to) => {
    setFromNight(from);
    setToNight(to);
    const newNight = { from, to };
    setResMessage('');
    checkVariants(newNight);

    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
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
        <Header closeModalHandler={closeHandler} svg={svgNight} />
        <h3 className="title">
          <FM id="mainform.night.t" />
        </h3>
        {loading ? (
          <Loader />
        ) : (
          <>
            <div className={`${styles.popup_scrollable_content} popup_scrollable_content`} ref={scrollable}>
              {resMessage && <div style={{ marginBottom: '20px' }}>{resMessage}</div>}
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
          </>
        )}
      </div>
    </SimpleBarWrapper>
  );
}
