import { useRef, useEffect } from 'react';
import { useGetOpenStreetMap } from 'store/store';
import L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import ratingColor from 'utils/ratingColor';
import styles from './hotelCardsMap.module.css';
import 'leaflet/dist/leaflet.css';
import { clear, disableScroll, BODY } from 'utils/useBodyScroll';

export default function HotelCardsMap() {
  const { img, hotelName, rating, foodTransMessage, price, coords, stars } =
    useGetOpenStreetMap();

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

  return (
    <>
      <MapContainer
        center={position}
        zoom={coords.z}
        scrollWheelZoom={true}
        style={{ width: '80vw', height: '500px', zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
                          <img
                            src="/assets/img/svg/tour/star.svg"
                            alt="star"
                            width="12"
                            height="12"
                          />
                        </div>
                      );
                    })}
                  {rating > 0 ? (
                    <div
                      className={styles.review}
                      style={{ color: ratingColor(parseFloat(rating)) }}
                    >
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
