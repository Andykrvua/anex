import styles from './turDetails.module.css';
import { infoModal, food } from '/utils/constants';
import { dayMonthFormatDate } from 'utils/formattedDate';
import declension from 'utils/declension';
import { useEffect, useState } from 'react';
import Loader from 'components/common/loader';
import TransportBlock from './transportBlock';
import RoomBlock from './roomBlock';
import DurationBlock from './durationBlock';
import DatesBlock from './datesBlock';
import { useRouter } from 'next/router';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import {
  useSetModal,
  useSetOfferParams,
  useSetCurrentOffer,
  useSetWindowInfo,
  useGetCurrentOfferMailData,
  useSetCurrentOfferMailData,
} from 'store/store';
import { modal } from 'utils/constants';

export default function TurDetails({ data, country, hotel }) {
  const [offerData, setOfferdata] = useState(false);
  const [urlData, setUrldata] = useState(data);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  const intl = useIntl();
  const tTxt1 = intl.formatMessage({
    id: 'common.night1',
  });
  const tTxt2 = intl.formatMessage({
    id: 'common.night2',
  });
  const tTxt5 = intl.formatMessage({
    id: 'common.night5',
  });
  const decl = (val) => declension(val, tTxt1, tTxt2, tTxt5);

  const setModalInfo = useSetWindowInfo();
  const setModal = useSetModal();
  const setOfferParams = useSetOfferParams();
  const setCurrentOffer = useSetCurrentOffer();
  const setCurrentOfferMailData = useSetCurrentOfferMailData();

  const router = useRouter();

  const offerOptions = () => {
    const offerAllOpt = ['transfer', 'insurance', 'noNeedVisa'];
    const offerNotIncluded = offerAllOpt.filter(
      (item) => !offerData.o.includes(item)
    );
    const notIncl = offerNotIncluded.length ? true : false;
    return (
      <>
        {offerData.o.length && (
          <p className={styles.price_block_incl}>
            <span>Включено: </span>
            {offerData.o.map((item, ind) => offerOptText(item, ind))}
          </p>
        )}
        {offerData.o.length < 3 && (
          <p className={styles.price_block_notincl}>
            <span>Не включено:</span>{' '}
            {offerNotIncluded.map((item, ind) =>
              offerOptText(item, ind, notIncl)
            )}
          </p>
        )}
      </>
    );
  };

  const offerOptText = (item, ind, notIncl = false) => {
    let str = '';
    if (ind !== 0) {
      str = ', ';
    }
    notIncl && item === 'noNeedVisa' ? (item = item + 'Need') : null;
    return (
      str +
      intl.formatMessage({
        id: `offer_page.offer_opt.${item}`,
      })
    );
  };

  const copyHandler = () => {
    navigator.clipboard.writeText(urlData.offer);
    const val = {
      show: true,
      type: infoModal.info,
      text: intl.formatMessage({
        id: 'offer_page.btn_copy',
      }),
    };
    setModalInfo(val);
  };

  const addToListHandler = () => {
    let descr = `${intl.formatMessage({ id: food[offerData?.f] })}, `;

    const transports = {
      bus: 'hotel_card.transport.bus',
      air: 'hotel_card.transport.air',
      train: 'hotel_card.transport.train',
      ship: 'hotel_card.transport.ship',
    };

    descr += `за ${offerData.a + offerData.h} ${
      transports[offerData.t]
        ? intl.formatMessage({
            id: transports[offerData.t],
          })
        : ''
    }`;

    const fav = {
      img: `https://newimg.otpusk.com/2/500x375/${hotel.fh[0].src}`,
      hotelName: hotel.n,
      stars: parseInt(hotel.s.n),
      country: hotel.t.n,
      district: hotel.c.n,
      rating: hotel.r,
      reviews: hotel.v,
      description: descr,
      orders: [
        {
          end: new Date(offerData.dt).toLocaleDateString('default', {
            day: '2-digit',
            month: '2-digit',
          }),
          link: router.asPath,
          n: `${offerData.nh} ${decl(offerData.nh)}`,
          price: new Intl.NumberFormat('uk-UA', {
            style: 'currency',
            currency: 'UAH',
            maximumFractionDigits: 0,
            minimumFractionDigits: 0,
          }).format(offerData.pl),
          r: offerData.r,
          start: new Date(offerData.d).toLocaleDateString('default', {
            day: '2-digit',
            month: '2-digit',
          }),
        },
      ],
      id: hotel.i,
    };

    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.find((item) => item.id === hotel.i)) {
      const temp = favorites.filter((item) => item.id !== hotel.i);
      favorites = temp;
    }
    favorites.push(fav);
    localStorage.setItem('favorites', JSON.stringify(favorites));

    const val = {
      show: true,
      type: infoModal.ok,
      text: intl.formatMessage({
        id: 'favorites.add',
      }),
    };
    setModalInfo(val);
  };

  const peopleBlockData = (people) => {
    const str = people;
    const str_length = people.length;
    const adult = Number(str[0]);
    const childTemp = str_length - 1;
    const child = childTemp === 0 ? 0 : childTemp / 2;
    let childAge = [];
    if (childTemp === 0) {
      childAge = [0, 0, 0, 0];
    } else {
      childAge = [
        str[2] ? Number(str[1] === '0' ? str[2] : str[1] + str[2]) : 0,
        str[4] ? Number(str[3] === '0' ? str[4] : str[3] + str[4]) : 0,
        str[6] ? Number(str[5] === '0' ? str[6] : str[5] + str[6]) : 0,
        str[8] ? Number(str[7] === '0' ? str[8] : str[7] + str[8]) : 0,
      ];
    }

    // data from push store
    // return { adult, child, childAge };

    const tTxt1 = intl.formatMessage({
      id: 'common.tourist1',
    });
    const tTxt2 = intl.formatMessage({
      id: 'common.tourist2',
    });
    const tTxt5 = intl.formatMessage({
      id: 'common.tourist5',
    });

    const sumPerson = adult + child;
    const declensionPerson = declension(sumPerson, tTxt1, tTxt2, tTxt5);
    const personTitle = `${sumPerson} ${declensionPerson}`;
    return personTitle;
  };

  const transportNameHelper = () => {
    let str = 'Транспорт';
    if (offerData?.t === 'air') {
      return (str = intl.formatMessage({
        id: 'common.tr_fly',
      }));
    }
    if (offerData?.t === 'bus') {
      return (str = 'Автобус');
    }
    if (offerData?.t === 'no') {
      return (str = intl.formatMessage({
        id: 'common.tr_no',
      }));
    }
    return str;
  };

  const makeOrderOfferData = (offerData) => {
    let durationStr = `${offerData.nh}`;
    if (offerData.n - offerData.nh !== 0) {
      durationStr += ` + ${offerData.n - offerData.nh} ${intl.formatMessage({
        id: 'hotel_card.tour_time',
      })}`;
    }

    const dStart = new Date(offerData?.d);
    const dEnd = new Date(offerData?.dt);
    const datesStr = `${dayMonthFormatDate(
      dStart,
      router.locale
    )} - ${dayMonthFormatDate(dEnd, router.locale)}`;

    const orderData = {
      country: hotel.t.n,
      city: hotel.c.n,
      hotel: hotel.n,
      stars: hotel.s.n,
      duration: durationStr,
      dates: datesStr,
      transport: offerData.t,
      room: offerData.r,
      food: intl.formatMessage({
        id: food[offerData?.f],
      }),
      people: peopleBlockData(urlData.people),
      id: urlData.offer,
      cost: new Intl.NumberFormat('uk-UA', {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      }).format(offerData.pl),
    };
    setCurrentOfferMailData(orderData);
  };

  const getOfferData = async (currParams) => {
    if (error) {
      setError(false);
    }
    await fetch(
      `https://api.otpusk.com/api/2.6/tours/offer?offerId=${urlData.offer}&currencyLocal=uah&access_token=337da-65e22-26745-a251f-77b9e`
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((data) => {
        if (!data) {
          setError(true);
          setLoading(false);
          return;
        }
        console.log('data.offer', data.offer);
        setOfferdata(data.offer);
        currParams.food = data.offer.fn;
        currParams.dateStart = data.offer.d;
        currParams.nightCount = data.offer.nh;
        setOfferParams(currParams);
        setCurrentOffer(data.offer);
        makeOrderOfferData(data.offer);
        setLoading(false);
      })
      .catch((e) => {
        /* eslint-disable-next-line */
        console.log('error', e);
        setError(true);
        setLoading(false);
        return null;
      });
  };

  const getActTimeOffer = () => {
    const d = new Date(offerData?.last);
    const time = d.toLocaleTimeString('uk-UA', {
      hour: 'numeric',
      minute: 'numeric',
    });
    const date = d.toLocaleDateString('uk-UA', {
      month: 'numeric',
      day: 'numeric',
    });
    return time + ' ' + date;
  };

  const CopyCode = ({ code }) => {
    return (
      <button className={styles.btn_copy} onClick={copyHandler}>
        Код: {code}
        <svg
          width="15"
          height="14"
          viewBox="0 0 15 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5.16667 2.33317V9.33317C5.16667 9.64259 5.28958 9.93934 5.50838 10.1581C5.72717 10.3769 6.02391 10.4998 6.33333 10.4998H11C11.3094 10.4998 11.6062 10.3769 11.825 10.1581C12.0437 9.93934 12.1667 9.64259 12.1667 9.33317V4.22434C12.1666 4.06891 12.1356 3.91506 12.0753 3.77181C12.015 3.62857 11.9266 3.49881 11.8155 3.39017L9.88175 1.499C9.66379 1.28589 9.37108 1.16654 9.06625 1.1665H6.33333C6.02391 1.1665 5.72717 1.28942 5.50838 1.50821C5.28958 1.72701 5.16667 2.02375 5.16667 2.33317V2.33317Z"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M9.83333 10.4997V11.6663C9.83333 11.9758 9.71042 12.2725 9.49162 12.4913C9.27283 12.7101 8.97609 12.833 8.66667 12.833H4C3.69058 12.833 3.39383 12.7101 3.17504 12.4913C2.95625 12.2725 2.83333 11.9758 2.83333 11.6663V5.24967C2.83333 4.94026 2.95625 4.64351 3.17504 4.42472C3.39383 4.20592 3.69058 4.08301 4 4.08301H5.16667"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    );
  };

  useEffect(() => {
    getOfferData(data);
    // setTimeout(() => {
    // }, 3000);
  }, []);

  if (error) {
    return (
      <div className={styles.tur_wrapper}>
        <h4 style={{ color: 'var(--font-white)' }}>
          Произошла ошибка во время запроса
        </h4>
      </div>
    );
  }

  return (
    <div className={styles.tur_wrapper}>
      <div className={styles.tur_header}>
        <CopyCode code={urlData.offer} />
        <button className={styles.btn_add_to_list} onClick={addToListHandler}>
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.61043 5.7892L8.25156 5.42309L7.7032 4.86369L7.70188 4.86234L7.70189 4.86234C7.40584 4.55805 7.05181 4.31618 6.66071 4.15103C6.26961 3.98587 5.84938 3.90078 5.42484 3.90078C5.0003 3.90078 4.58006 3.98587 4.18896 4.15103C3.79803 4.31611 3.44413 4.55785 3.14816 4.86196C2.54003 5.49007 2.20001 6.33007 2.20001 7.20435C2.20001 8.07834 2.5398 8.91807 3.14755 9.54611C3.14789 9.54646 3.14823 9.54682 3.14857 9.54717L8.60845 15.1172L14.0631 9.54717C14.0635 9.54684 14.0638 9.54651 14.0641 9.54618C14.6719 8.91814 15.0117 8.07837 15.0117 7.20435C15.0117 6.33005 14.6717 5.49003 14.0635 4.86192C13.7676 4.55774 13.4137 4.31594 13.0227 4.15079C12.6317 3.98559 12.2115 3.90045 11.7869 3.90039L8.61043 5.7892ZM8.61043 5.7892L8.96745 5.42128M8.61043 5.7892L8.96745 5.42128M8.96745 5.42128L9.50988 4.86229C9.51 4.86216 9.51013 4.86204 9.51025 4.86191C9.51026 4.8619 9.51027 4.86189 9.51028 4.86187C9.80622 4.55772 10.1601 4.31593 10.551 4.15079C10.9421 3.98559 11.3623 3.90045 11.7868 3.90039L8.96745 5.42128Z"
              stroke="#53536E"
            />
            <path
              d="M8.61043 5.7892L8.25156 5.42309L7.7032 4.86369L7.70188 4.86234L7.70189 4.86234C7.40584 4.55805 7.05181 4.31618 6.66071 4.15103C6.26961 3.98587 5.84938 3.90078 5.42484 3.90078C5.0003 3.90078 4.58006 3.98587 4.18896 4.15103C3.79803 4.31611 3.44413 4.55785 3.14816 4.86196C2.54003 5.49007 2.20001 6.33007 2.20001 7.20435C2.20001 8.07834 2.5398 8.91807 3.14755 9.54611C3.14789 9.54646 3.14823 9.54682 3.14857 9.54717L8.60845 15.1172L14.0631 9.54717C14.0635 9.54684 14.0638 9.54651 14.0641 9.54618C14.6719 8.91814 15.0117 8.07837 15.0117 7.20435C15.0117 6.33005 14.6717 5.49003 14.0635 4.86192C13.7676 4.55774 13.4137 4.31594 13.0227 4.15079C12.6317 3.98559 12.2115 3.90045 11.7869 3.90039L8.61043 5.7892ZM8.61043 5.7892L8.96745 5.42128M8.61043 5.7892L8.96745 5.42128M8.96745 5.42128L9.50988 4.86229C9.51 4.86216 9.51013 4.86204 9.51025 4.86191C9.51026 4.8619 9.51027 4.86189 9.51028 4.86187C9.80622 4.55772 10.1601 4.31593 10.551 4.15079C10.9421 3.98559 11.3623 3.90045 11.7868 3.90039L8.96745 5.42128Z"
              stroke="url(#paint0_linear_4515_5649)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_4515_5649"
                x1="1.87266"
                y1="-8.04425"
                x2="21.4749"
                y2="-4.24069"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.240837" stopColor="#FF9400" />
                <stop offset="1" stopColor="#FF1821" />
              </linearGradient>
            </defs>
          </svg>
          <FM id="offer_page.add_favor" />
        </button>
      </div>
      <h2 className={styles.tur_title}>
        <FM id="offer_page.tur_details" />
      </h2>
      <div className={styles.tur_grid}>
        {/* Grid Item Person */}
        <div className={styles.grid_item}>
          <div className={styles.grid_item_header}>
            <span>
              <FM id="mainform.person.t" />
            </span>
            <button
              onClick={() => setModal({ get: modal.offerPageChangePerson })}
              className={styles.change_btn}
            >
              <FM id="common.change" />
            </button>
          </div>
          <div
            className={`${styles.grid_item_content} ${
              !loading ? styles.col_2_grid : ''
            }`}
          >
            {loading ? (
              <Loader />
            ) : (
              <>
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="var(--primary)"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M15.75 26.25h-3.5a1.75 1.75 0 0 1-1.75-1.75v-6.125a1.75 1.75 0 0 1-1.75-1.75v-5.25a2.625 2.625 0 0 1 2.625-2.625h5.25a2.625 2.625 0 0 1 2.625 2.625v5.25a1.75 1.75 0 0 1-1.75 1.75V24.5a1.75 1.75 0 0 1-1.75 1.75ZM11.375 10.5a.824.824 0 0 0-.875.875v5.25h1.75V24.5h3.5v-7.875h1.75v-5.25a.824.824 0 0 0-.875-.875h-5.25ZM14 7.875a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7Zm0-5.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z"></path>
                </svg>
                <div className={styles.grid_item_content_text}>
                  {peopleBlockData(urlData.people)}
                </div>
              </>
            )}
          </div>
        </div>
        {/* Grid Item transport */}
        <div className={styles.grid_item}>
          <div className={styles.grid_item_header}>
            <span>{loading ? 'Транспорт' : transportNameHelper()}</span>
            <button className={styles.change_btn} disabled>
              <FM id="common.change" />
            </button>
          </div>
          <div className={styles.grid_item_content}>
            {loading ? (
              <Loader />
            ) : (
              offerData && (
                <TransportBlock
                  offerData={offerData}
                  country={country}
                  data={urlData}
                />
              )
            )}
          </div>
        </div>
        {/* Grid Item room */}
        <div className={styles.grid_item}>
          <div className={styles.grid_item_header}>
            <span>
              <FM id="offer_page.room_food" />
            </span>
            <button
              className={styles.change_btn}
              onClick={() => setModal({ get: modal.offerPageChangeRoom })}
            >
              <FM id="common.change" />
            </button>
          </div>
          <div
            className={`${styles.grid_item_content} ${
              !loading ? styles.col_2_grid : ''
            }`}
          >
            {loading ? (
              <Loader />
            ) : (
              offerData && <RoomBlock offerData={offerData} />
            )}
          </div>
        </div>
        {/* Grid Item duration */}
        <div className={styles.grid_item}>
          <div className={styles.grid_item_header}>
            <span>
              <FM id="offer_page.tour_duration" />
            </span>
            <button
              className={styles.change_btn}
              onClick={() => setModal({ get: modal.offerPageChangeNight })}
            >
              <FM id="common.change" />
            </button>
          </div>
          <div
            className={`${styles.grid_item_content} ${
              !loading ? styles.col_2_grid : ''
            }`}
          >
            {loading ? (
              <Loader />
            ) : (
              offerData && <DurationBlock offerData={offerData} />
            )}
          </div>
        </div>
        {/* Grid Item dates */}
        <div className={`${styles.grid_item} ${styles.grid_item_scroll}`}>
          <div className={styles.grid_item_header}>
            <span>
              <FM id="offer_page.need_v" />
              <span className={styles.grid_item_header_title_normal}>
                {' '}
                <FM id="offer_page.need_v2" />
              </span>
            </span>
          </div>
          <div
            className={`${styles.grid_item_content} ${styles.grid_item_content_calendar}`}
          >
            {loading ? (
              <Loader />
            ) : (
              offerData && <DatesBlock offerData={offerData} data={urlData} />
            )}
          </div>
        </div>
        {/* Grid Item price */}
        <div className={styles.grid_item}>
          <div
            className={`${styles.grid_item_header} ${styles.grid_item_header_green}`}
          >
            <span>
              <FM id="offer_page.cost" />
            </span>
            <span className={styles.offer_act_time}>
              <FM id="offer_page.cost_actual" />{' '}
              {loading ? '' : getActTimeOffer()}{' '}
            </span>
          </div>
          <div className={styles.grid_item_content}>
            {loading ? (
              <Loader />
            ) : (
              offerData && (
                <div className={styles.price_block}>
                  {offerOptions()}
                  <div className={styles.price_block_numbers}>
                    <CopyCode code={urlData.offer} />
                    <div className={styles.price_block_sum}>
                      <span>👍 </span>
                      {new Intl.NumberFormat('uk-UA', {
                        maximumFractionDigits: 0,
                        minimumFractionDigits: 0,
                      }).format(offerData.pl)}
                      <span className={styles.price_block_sum_curr}> грн</span>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
          <div>
            <button
              className={styles.order_btn}
              onClick={() => setModal({ get: modal.offerPageOrder })}
            >
              <FM id="offer_page.bron_online" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
