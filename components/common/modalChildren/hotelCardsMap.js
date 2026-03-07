import { useRef, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useGetOpenStreetMap, useGetStaticData } from 'store/store';
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
  const { img, hotelName, rating, foodTransMessage, price, coords, stars } = useGetOpenStreetMap();
  const staticData = useGetStaticData();

  const icon = L.icon({ iconUrl: '/assets/img/svg/results/map-marker.svg' });

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
          <CustomMarker position={position} icon={icon}>
            <Popup closeButton={false} className={styles.custom_popup}>
              <div className={styles.map}>
                <img src={img} alt={hotelName} width="150" />
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
                  <div className={styles.food_trans_mess}>{foodTransMessage}</div>
                  <div className={styles.order_price}>{price}</div>
                </div>
              </div>
            </Popup>
          </CustomMarker>
        </MapContainer>
      </div>
      <style global jsx>{`
        .leaflet-marker-icon {
          left: -8px;
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
