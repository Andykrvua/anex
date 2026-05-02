import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useIntl } from 'react-intl';
import { shimmer, toBase64 } from 'utils/blurImage';
import {
  useSetModal,
  useGetPerson,
  useSetOpenStreetMap,
  useSetWindowInfo,
  useGetDown,
} from 'store/store';
import ratingColor from 'utils/ratingColor';
import declension from 'utils/declension';
import { food, modal, infoModal } from 'utils/constants';
import {
  useSearchStatus,
  useHotelUnviewedUpdates,
  useMarkUpdatesViewed,
} from 'store/searchStore';
import useViewedObserver from 'hooks/useViewedObserver';
import CardBadge from './CardBadge';
import OfferSlot from './OfferSlot';
import styles from './HotelCard.module.css';
import v2styles from './v2cards.module.css';

const TRANSPORT_KEYS = {
  bus: 'hotel_card.transport.bus',
  air: 'hotel_card.transport.air',
  train: 'hotel_card.transport.train',
  ship: 'hotel_card.transport.ship',
};

const formatPrice = (uah) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(uah);

const formatDayMonth = (iso) =>
  new Date(iso).toLocaleDateString('default', {
    day: '2-digit',
    month: '2-digit',
  });

function Rating({ hotel }) {
  if (!hotel || !hotel.rb) return null;
  const items = [];
  Object.entries(hotel.rb).forEach((el) => {
    const r = el[1];
    if ((r.site === 'tripadvisor' || r.site === 'booking') && r.rating !== 0) {
      items.push(r);
    }
  });
  if (!items.length) return null;
  return (
    <div className={styles.review}>
      {items.map((el) => (
        <div className={styles.review_item} key={el.site}>
          <img
            src={`/assets/img/svg/${el.site}.svg`}
            alt={el.site}
            title={el.site}
            width="24"
            height="24"
          />
          <p
            className={styles.review__number}
            style={{ color: ratingColor(parseFloat(el.rating)) }}
          >
            {el.rating}/10
          </p>
        </div>
      ))}
    </div>
  );
}

export default function HotelCard({
  hotel,
  searchParams,
  countryHotelService = [],
  slots,
  isHighlighted = false,
}) {
  const router = useRouter();
  const intl = useIntl();
  const setModal = useSetModal();
  const person = useGetPerson();
  const setOpenStreetMapData = useSetOpenStreetMap();
  const down = useGetDown();
  const setModalInfo = useSetWindowInfo();
  const status = useSearchStatus();
  const isSearching = status === 'searching';

  const unviewed = useHotelUnviewedUpdates(hotel.i);
  const markUpdatesViewed = useMarkUpdatesViewed();
  const cardRef = useRef(null);
  const unviewedIds = useMemo(() => unviewed.map((u) => u.id), [unviewed]);
  useViewedObserver(cardRef, unviewedIds, markUpdatesViewed);

  // Per-slot updates: 1 update на (hotel, type, nights). Если их несколько
  // на один слот (теоретически возможно при двух snapshot подряд) —
  // показываем самый свежий.
  const updatesByNights = useMemo(() => {
    const out = {};
    for (const u of unviewed) {
      if (u.type !== 'price_drop' && u.type !== 'slot_filled') continue;
      if (typeof u.nights !== 'number') continue;
      const cur = out[u.nights];
      if (!cur || u.snapshotVersion > cur.snapshotVersion) out[u.nights] = u;
    }
    return out;
  }, [unviewed]);
  const hasUnviewed = unviewed.length > 0;

  const tTxt1 = intl.formatMessage({ id: 'common.night1' });
  const tTxt2 = intl.formatMessage({ id: 'common.night2' });
  const tTxt5 = intl.formatMessage({ id: 'common.night5' });
  const decl = (val) => declension(val, tTxt1, tTxt2, tTxt5);

  // Дедуп по pl как в legacy CardsOffersVariants — нужно для food message.
  const dedupedByPrice = (hotel.allOffers || []).reduce((acc, val, ind, arr) => {
    if (ind === 0) acc.push(val);
    else if (val.pl !== arr[ind - 1].pl) acc.push(val);
    return acc;
  }, []);
  const foodHelper = new Set(dedupedByPrice.map((o) => o.f));
  const foodTxt = Array.from(foodHelper);
  let foodTransMessage = '';
  if (foodTxt.length === 1 && food[foodTxt[0]]) {
    foodTransMessage = intl.formatMessage({ id: food[foodTxt[0]] }) + ', ';
  }
  const transportKey = TRANSPORT_KEYS[router.query.transport];
  foodTransMessage += `за ${person.adult + person.child} ${
    transportKey ? intl.formatMessage({ id: transportKey }) : ''
  }`;

  const cheapest = hotel.allOffers && hotel.allOffers[0];

  // Side effects for feature parity с legacy:
  //   - localStorage 'result' — read by favorites модал и hotel-страница.
  //   - cookie с рейтингами TA/Booking — read hotel-страницей при заходе.
  // Делаем в effect (не на render), чтобы не плодить SSR-проблем.
  useEffect(() => {
    if (!cheapest) return;
    const localePrefix = router.locale === 'uk' ? '/uk' : '';
    const buildLink = (offerI) =>
      `${localePrefix}/hotels/${hotel.t.c}/${hotel.t.i}-${hotel.i}-${hotel.h}` +
      `?offer=${offerI}` +
      `&transport=${searchParams.transport}` +
      `&from=${searchParams.from}` +
      `&fromname=${searchParams.fromname}` +
      `&to=${searchParams.to}` +
      `&checkIn=${searchParams.checkIn}` +
      `&checkTo=${searchParams.checkTo}` +
      `&nights=${searchParams.nights}` +
      `&nightsTo=${searchParams.nightsTo}` +
      `&people=${searchParams.people}`;

    const orders = (hotel.allOffers || []).slice(0, 6).map((o) => ({
      link: buildLink(o.i),
      start: formatDayMonth(o.d),
      end: formatDayMonth(o.dt),
      n: `${o.nh} ${decl(o.nh)}`,
      r: o.r,
      price: formatPrice(o.pl),
      id: o.i,
    }));
    const itemRecord = {
      img: `https://newimg.otpusk.com/2/500x375/${hotel.f}`,
      hotelName: hotel.n,
      stars: parseInt(hotel.s),
      country: hotel.t.n,
      district: hotel.c.n,
      rating: hotel.r,
      reviews: hotel.v,
      description: foodTransMessage,
      orders,
      id: hotel.i,
    };
    const existing = JSON.parse(localStorage.getItem('result') || '[]');
    const without = existing.filter((r) => r.id !== hotel.i);
    without.push(itemRecord);
    localStorage.setItem('result', JSON.stringify(without));

    // Ratings (TripAdvisor / Booking) — read by hotel page.
    // Stored in localStorage as a single map to avoid bloating Cookie header (HTTP 431).
    if (hotel.rb) {
      const ratingItems = [];
      Object.entries(hotel.rb).forEach((el) => {
        const r = el[1];
        if ((r.site === 'tripadvisor' || r.site === 'booking') && r.rating !== 0) {
          ratingItems.push(r);
        }
      });
      if (ratingItems.length) {
        try {
          const map = JSON.parse(localStorage.getItem('hotelRatings') || '{}');
          map[hotel.i] = ratingItems;
          localStorage.setItem('hotelRatings', JSON.stringify(map));
        } catch (e) {
          // ignore — storage may be unavailable (private mode / quota).
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotel.i, hotel.allOffers]);

  const addToFavorites = (id) => {
    const stored = JSON.parse(localStorage.getItem('result') || '[]');
    if (stored.length) {
      const add = stored.filter((tour) => tour.id === id);
      if (add.length) {
        let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        if (favorites.find((it) => it.id === id)) {
          favorites = favorites.filter((it) => it.id !== id);
        }
        favorites.push(add[0]);
        localStorage.setItem('favorites', JSON.stringify(favorites));
      }
    }
    setModalInfo({
      show: true,
      type: infoModal.ok,
      text: intl.formatMessage({ id: 'favorites.add' }),
    });
  };

  const openMap = () => {
    if (!hotel.g || !cheapest) return;
    const localePrefix = router.locale === 'uk' ? '/uk' : '';
    const cheapestLink =
      `${localePrefix}/hotels/${hotel.t.c}/${hotel.t.i}-${hotel.i}-${hotel.h}` +
      `?offer=${cheapest.i}` +
      `&transport=${searchParams.transport}` +
      `&from=${searchParams.from}` +
      `&fromname=${searchParams.fromname}` +
      `&to=${searchParams.to}` +
      `&checkIn=${searchParams.checkIn}` +
      `&checkTo=${searchParams.checkTo}` +
      `&nights=${searchParams.nights}` +
      `&nightsTo=${searchParams.nightsTo}` +
      `&people=${searchParams.people}`;
    const price = formatPrice(cheapest.pl);
    const nightsStr = `${cheapest.nh} ${decl(cheapest.nh)}`;
    const favData = {
      img: `https://newimg.otpusk.com/2/500x375/${hotel.f}`,
      hotelName: hotel.n,
      stars: parseInt(hotel.s),
      country: hotel.t.n,
      district: hotel.c.n,
      rating: hotel.r,
      reviews: hotel.v,
      description: foodTransMessage,
      orders: [
        {
          end: formatDayMonth(cheapest.dt),
          link: cheapestLink,
          n: nightsStr,
          price,
          r: cheapest.r,
          start: formatDayMonth(cheapest.d),
        },
      ],
      id: hotel.i,
    };
    setOpenStreetMapData({
      img: `https://newimg.otpusk.com/2/400x300/${hotel.f}`,
      hotelName: hotel.n,
      rating: hotel.r,
      checkIn: new Date(cheapest.d).toLocaleDateString(
        router.locale === 'uk' ? 'uk-UA' : 'ru-RU',
        { day: 'numeric', month: 'long' },
      ),
      nights: nightsStr,
      foodTransMessage,
      price,
      coords: hotel.g,
      stars: hotel.s,
      cityId: hotel.c && hotel.c.i,
      countryId: down.countryValue,
      hotelId: hotel.i,
      mapContext: 'search',
      mapSearchParams: searchParams,
      favData,
    });
    setModal({ get: modal.hotelCardsMap });
  };

  // Properties → svg-icon (как в legacy `tour_propertys`).
  const renderProperties = () => {
    if (!hotel.e || !countryHotelService.length) return null;
    const out = [];
    hotel.e.forEach((property, ind) => {
      countryHotelService.forEach((svc) => {
        Object.entries(svc).forEach(([key, label]) => {
          if (key === property) {
            out.push(
              <div className={styles.tour_property} key={`${hotel.i}-${property}-${ind}`}>
                <img
                  className={styles.tour_property__icon}
                  src={`/assets/img/svg/tour_property/${key}.svg`}
                  alt=""
                />
                <p className={styles.tour_property__title}>{label}</p>
              </div>,
            );
          }
        });
      });
    });
    return out;
  };

  return (
    <div
      ref={cardRef}
      className={[
        styles.card,
        hasUnviewed ? v2styles.cardUpdated : '',
        isHighlighted ? v2styles.cardHighlight : '',
      ]
        .filter(Boolean)
        .join(' ')}
      id={`hotel-${hotel.i}`}
      data-hotel-id={hotel.i}
    >
      <div className={styles.card_img}>
        <Image
          className={styles.img}
          src={`https://newimg.otpusk.com/2/500x375/${hotel.f}`}
          alt=""
          layout="fill"
          placeholder="blur"
          blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(500, 375))}`}
        />
        <Rating hotel={hotel} />
        <button
          className={styles.favorites_btn}
          onClick={() => addToFavorites(hotel.i)}
          aria-label="favorites"
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M4.98456 14.4375L13.1659 22.7838L21.3394 14.4375L21.3413 14.4355C22.2281 13.5189 22.7239 12.2935 22.7239 11.018C22.7239 9.74207 22.2277 8.51616 21.3402 7.59944C20.9096 7.15681 20.3946 6.80494 19.8256 6.56462C19.2565 6.3242 18.6448 6.20029 18.027 6.2002C17.4091 6.20029 16.7976 6.3242 16.2285 6.56462C15.6595 6.80496 15.144 7.15741 14.7133 7.60009L13.8839 8.45483L13.1698 9.19067L12.4521 8.45845L11.6134 7.60289L11.6108 7.6002C11.1799 7.15735 10.6647 6.80534 10.0955 6.56498C9.52633 6.32463 8.91475 6.20079 8.29689 6.20079C7.67904 6.20079 7.06745 6.32463 6.49827 6.56498C5.92942 6.8052 5.41446 7.15692 4.98378 7.59939C4.0963 8.51612 3.6001 9.74205 3.6001 11.018C3.6001 12.2934 4.09584 13.5188 4.98254 14.4354L4.98456 14.4375Z"
              stroke="url(#paint0_linear_v2_card)"
              strokeWidth="2"
            />
            <defs>
              <linearGradient
                id="paint0_linear_v2_card"
                x1="2.86414"
                y1="-12.3034"
                x2="32.8441"
                y2="-6.48617"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0.240837" stopColor="#FF9400" />
                <stop offset="1" stopColor="#FF1821" />
              </linearGradient>
            </defs>
          </svg>
        </button>
      </div>
      <div className={styles.card_text}>
        <CardBadge updates={unviewed} />
        <div className={styles.stars_wrapper}>
          {new Array(parseInt(hotel.s) || 0).fill(null).map((_, ind) => (
            <div className={styles.stars} key={ind}>
              <img src="/assets/img/svg/tour/star.svg" alt="star" width="12" height="12" />
            </div>
          ))}
        </div>
        <h4 className={styles.hotel_name}>{hotel.n}</h4>
        <div className={styles.tour_propertys}>{renderProperties()}</div>
        <div className={styles.maps_and_options}>
          {hotel.g && cheapest && (
            <button onClick={openMap} className={styles.maps}>
              <img src="/assets/img/svg/tour/map-marker.svg" alt="map" />
              <span>{`${hotel.t.n}, ${hotel.c.n}`}</span>
            </button>
          )}
          <p className={styles.options}>{foodTransMessage}</p>
        </div>
        {slots.map((nights) => (
          <OfferSlot
            key={nights}
            hotel={hotel}
            nights={nights}
            offer={hotel.offers ? hotel.offers[nights] : null}
            isSearching={isSearching}
            searchParams={searchParams}
            slotUpdate={updatesByNights[nights] || null}
            history={hotel.history ? hotel.history[nights] : null}
          />
        ))}
      </div>
    </div>
  );
}

