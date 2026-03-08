import { useRef, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useGetOpenStreetMap, useGetStaticData, useSetWindowInfo } from 'store/store';
import { infoModal, languagesOperatorApi } from 'utils/constants';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import ratingColor from 'utils/ratingColor';
import styles from './hotelCardsMap.module.css';
import 'leaflet/dist/leaflet.css';
import { clear, disableScroll, BODY } from 'utils/useBodyScroll';
import SwitchMenu from 'components/common/switchMenu/switchMenu';

export default function HotelCardsMap() {
  const intl = useIntl();
  const [activeLayer, setActiveLayer] = useState('osm');
  const {
    img,
    hotelName,
    rating,
    checkIn,
    nights,
    foodTransMessage,
    price,
    coords,
    stars,
    cityId,
    countryId,
    hotelId,
    favData,
  } = useGetOpenStreetMap();
  const staticData = useGetStaticData();
  const setWindowInfo = useSetWindowInfo();
  const [nearbyHotels, setNearbyHotels] = useState([]);

  useEffect(() => {
    if (!coords?.a || !coords?.o) return;
    setNearbyHotels([]);
    const params = new URLSearchParams({
      lat: coords.a,
      lon: coords.o,
      lang: languagesOperatorApi[intl.locale] || '',
    });
    if (countryId) params.set('countryId', countryId);
    if (cityId) params.set('cityId', cityId);
    fetch(`/api/endpoints/nearbyHotels?${params}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.ok && data.hotels) {
          setNearbyHotels(data.hotels.filter((h) => h.id !== hotelId));
        }
      })
      .catch(() => {});
  }, [coords?.a, coords?.o]);

  const saveToFavorites = () => {
    if (!favData) return;
    let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    if (favorites.find((item) => item.id === favData.id)) {
      favorites = favorites.filter((item) => item.id !== favData.id);
    }
    favorites.push(favData);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    setWindowInfo({ show: true, type: infoModal.ok, text: intl.formatMessage({ id: 'favorites.add' }) });
  };

  const markerPath =
    'M5.50008 0.416504C4.18505 0.416504 2.92388 0.938898 1.99401 1.86877C1.06414 2.79863 0.541748 4.05981 0.541748 5.37484C0.541748 9.09359 5.50008 14.5832 5.50008 14.5832C5.50008 14.5832 10.4584 9.09359 10.4584 5.37484C10.4584 4.05981 9.93602 2.79863 9.00615 1.86877C8.07629 0.938898 6.81511 0.416504 5.50008 0.416504Z';

  const darkenColor = (hex, amount = 40) => {
    const r = Math.max(0, parseInt(hex.slice(1, 3), 16) - amount);
    const g = Math.max(0, parseInt(hex.slice(3, 5), 16) - amount);
    const b = Math.max(0, parseInt(hex.slice(5, 7), 16) - amount);
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  };

  const makeIcon = (color, starsCount = null) => {
    const strokeColor = darkenColor(color);
    const label = starsCount
      ? `<text x="5.5" y="5.8" text-anchor="middle" dominant-baseline="middle" font-size="6" font-weight="bold" fill="white" font-family="sans-serif">${starsCount}</text>`
      : '';
    return L.divIcon({
      html: `<svg width="22" height="30" viewBox="0 0 11 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${markerPath}" fill="${color}" stroke="${strokeColor}" stroke-width="0.5"/>${label}</svg>`,
      className: '',
      iconSize: [22, 30],
    });
  };

  const nearbyMarkerColor = (starsCount) => {
    const s = parseInt(starsCount) || 0;
    if (s <= 3) return '#FFB300';
    if (s === 4) return '#8BC34A';
    return '#55b54a';
  };

  const icon = makeIcon('#0080ff', parseInt(stars) || null);

  const CustomMarker = (props) => {
    const leafletRef = useRef();

    useEffect(() => {
      leafletRef.current.openPopup();
      disableScroll(BODY);
      return () => {
        clear();
      };
    }, []);

    return <Marker ref={leafletRef} {...props} />;
  };

  const position = [coords.a, coords.o];

  const layerItems = [
    { name: intl.formatMessage({ id: 'map.layer_map' }), value: 'osm' },
    { name: intl.formatMessage({ id: 'map.layer_satellite' }), value: 'satellite' },
  ];

  return (
    <>
      <div className={styles.map_wrapper}>
        <div className={styles.layer_control}>
          <SwitchMenu
            items={layerItems}
            name="map_layer"
            callback={[activeLayer, setActiveLayer]}
            style={{ background: 'white' }}
          />
        </div>
        <MapContainer
          center={position}
          zoom={coords.z}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%', zIndex: 1 }}
        >
          {activeLayer === 'osm' ? (
            <TileLayer
              key="osm"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          ) : staticData?.google_satellite_map ? (
            <TileLayer
              key="google"
              attribution='&copy; <a href="https://maps.google.com/">Google</a>'
              url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
            />
          ) : (
            <TileLayer
              key="esri"
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            />
          )}
          {nearbyHotels.map((hotel) => (
            <Marker
              key={hotel.id}
              position={[parseFloat(hotel.lat), parseFloat(hotel.long)]}
              icon={makeIcon(nearbyMarkerColor(hotel.stars), parseInt(hotel.stars) || null)}
            >
              <Popup closeButton={false} className={styles.custom_popup}>
                <div className={styles.map}>
                  <div className={styles.img_wrapper}>
                    <img
                      src={`https://newimg.otpusk.com/2/400x300/${hotel.image}`}
                      alt={hotel.name}
                      width="150"
                    />
                  </div>
                  <div className={styles.text}>
                    <div className={styles.title}>{hotel.name}</div>
                    <div className={styles.ratings}>
                      {new Array(parseInt(hotel.stars) || 0).fill(null).map((_, i) => (
                        <div className={styles.stars} key={i}>
                          <img src="/assets/img/svg/tour/star.svg" alt="star" width="12" height="12" />
                        </div>
                      ))}
                    </div>
                    {/* <button className={styles.nearby_btn}> */}
                    <button className={`main_form_btn ${styles.nearby_btn}`}>
                      {intl.formatMessage({ id: 'map.find_tours' })}
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          <CustomMarker position={position} icon={icon}>
            <Popup closeButton={false} className={styles.custom_popup}>
              <div className={styles.map}>
                <div className={styles.img_wrapper}>
                  <img src={img} alt={hotelName} width="150" />
                  {favData && (
                    <button className={styles.fav_btn} onClick={saveToFavorites}>
                      <svg
                        width="26"
                        height="26"
                        viewBox="0 0 26 26"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M4.98456 14.4375L13.1659 22.7838L21.3394 14.4375L21.3413 14.4355C22.2281 13.5189 22.7239 12.2935 22.7239 11.018C22.7239 9.74207 22.2277 8.51616 21.3402 7.59944C20.9096 7.15681 20.3946 6.80494 19.8256 6.56462C19.2565 6.3242 18.6448 6.20029 18.027 6.2002C17.4091 6.20029 16.7976 6.3242 16.2285 6.56462C15.6595 6.80496 15.144 7.15741 14.7133 7.60009L13.8839 8.45483L13.1698 9.19067L12.4521 8.45845L11.6134 7.60289L11.6108 7.6002C11.1799 7.15735 10.6647 6.80534 10.0955 6.56498C9.52633 6.32463 8.91475 6.20079 8.29689 6.20079C7.67904 6.20079 7.06745 6.32463 6.49827 6.56498C5.92942 6.8052 5.41446 7.15692 4.98378 7.59939C4.0963 8.51612 3.6001 9.74205 3.6001 11.018C3.6001 12.2934 4.09584 13.5188 4.98254 14.4354L4.98456 14.4375Z"
                          stroke="url(#fav_gradient_map)"
                          strokeWidth="2"
                        />
                        <defs>
                          <linearGradient
                            id="fav_gradient_map"
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
                  )}
                </div>
                <div className={styles.text}>
                  <div className={styles.title}>{hotelName}</div>
                  <div className={styles.ratings}>
                    {stars &&
                      new Array(parseInt(stars)).fill(null).map((_, ind) => {
                        return (
                          <div className={styles.stars} key={ind}>
                            <img src="/assets/img/svg/tour/star.svg" alt="star" width="12" height="12" />
                          </div>
                        );
                      })}
                    {rating > 0 ? (
                      <div className={styles.review} style={{ color: ratingColor(parseFloat(rating)) }}>
                        {rating}/10
                      </div>
                    ) : null}
                  </div>
                  <div className={styles.food_trans_mess}>
                    {[nights, checkIn, foodTransMessage].filter(Boolean).join(', ')}
                  </div>
                  <div className={styles.order_price}>{price}</div>
                </div>
              </div>
            </Popup>
          </CustomMarker>
        </MapContainer>
      </div>
      <style global jsx>{`
        .leaflet-marker-icon {
          top: 15px;
        }
        .leaflet-popup-content-wrapper {
          padding: 0px;
        }
        .leaflet-popup-content {
          margin: 0;
        }
      `}</style>
    </>
  );
}
