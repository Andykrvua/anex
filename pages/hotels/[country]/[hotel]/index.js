import styles from 'components/hotels/country/hotel/hotel.module.css';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import ratingColor from 'utils/ratingColor';
import { stars, modal, languagesOperatorApi } from 'utils/constants';
import { useSetModal, useSetOpenStreetMap } from 'store/store';
import { useState } from 'react';
import TurDetails from 'components/hotels/country/hotel/turDetails';
import ImgSlider from 'components/hotels/country/hotel/imgSlider';

export default function Hotel({ data, hotel }) {
  const intl = useIntl();
  const br_arr = [{ title: hotel?.n }];
  const setOpenStreetMapData = useSetOpenStreetMap();
  const setModal = useSetModal();

  const OpenStreetMapBtn = () => {
    if (!hotel.g) {
      return null;
    }

    const modalHandler = () => {
      setOpenStreetMapData({
        img: `https://newimg.otpusk.com/2/400x300/${hotel.fh[0].src}`,
        hotelName: hotel.n,
        rating: hotel.r,
        foodTransMessage: '',
        price: '',
        coords: hotel.g,
        stars: Number(stars[hotel.s.s]) ? stars[hotel.s.s] : 0,
      });
      setModal({ get: modal.hotelCardsMap });
    };

    return (
      <button onClick={() => modalHandler()} className={styles.maps}>
        <img src="/assets/img/svg/tour/map-marker.svg" alt="map" />
        <span>
          <FM id="hotel_card.map" />
        </span>
      </button>
    );
  };

  const ReadMore = () => {
    const [isReadMore, setIsReadMore] = useState(false);
    const toggleReadMore = () => {
      setIsReadMore(!isReadMore);
    };
    return (
      <>
        {hotel?.o?.dc && <p>{hotel.o.dc}</p>}
        {hotel?.o?.b && <p>{hotel.o.b}</p>}
        {hotel?.o?.c && <p>{hotel.o.c}</p>}
        {isReadMore && hotel?.o?.di && <p>{hotel.o.di}</p>}
        {isReadMore && hotel?.o?.ds && <p>{hotel.o.ds}</p>}
        {isReadMore && hotel?.o?.fa && <p>{hotel.o.fa}</p>}
        {isReadMore && hotel?.o?.fh && <p>{hotel.o.fh}</p>}
        {isReadMore && hotel?.o?.s && <p>{hotel.o.s}</p>}

        <p onClick={toggleReadMore} className={styles.read_or_hide}>
          {isReadMore ? ' Скрыть' : '... Показать больше'}
        </p>
      </>
    );
  };

  if (!hotel) {
    return (
      <div className="container">
        <div>
          <FM id="error.block" />
        </div>
      </div>
    );
  }
  return (
    <>
      <SeoHead content={null} />
      <div className="container">
        <Breadcrumbs data={br_arr} />
        <div className={styles.card}>
          <ImgSlider images={hotel.fh} />
          <div className={styles.card_text}>
            <h1 className={styles.hotel_name}>{hotel.n}</h1>
            <div className={styles.texts_grid}>
              {hotel.r ? (
                <div className={styles.review}>
                  {!hotel.v && (
                    <p>
                      <FM id="hotel_card.rating" />
                    </p>
                  )}
                  <p
                    className={styles.review__number}
                    style={{ color: ratingColor(parseFloat(hotel.r)) }}
                  >
                    {hotel.r}/10
                  </p>
                  {hotel.v && (
                    <p>
                      <FM id="hotel_card.reviews" />
                    </p>
                  )}
                  {hotel.v && (
                    <p className={styles.review__medium}>{hotel.v}</p>
                  )}
                </div>
              ) : null}
              <div className={styles.texts_grid_right}>
                <div className={styles.stars_wrapper}>
                  {new Array(Number(stars[hotel.s.s]) ? stars[hotel.s.s] : 0)
                    .fill(null)
                    .map((_, ind) => {
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
                </div>
                <p className={styles.country_text}>
                  {`${hotel.t.n}, ${hotel.c.n}`}
                </p>
                <OpenStreetMapBtn />
              </div>
            </div>

            <div className={styles.tour_propertys}>
              {hotel?.e?.b &&
                Object.entries(hotel.e.b).map(([key, value], ind) => {
                  return (
                    <div className={styles.tour_property} key={ind}>
                      <img
                        className={styles.tour_property__icon}
                        src={`/assets/img/svg/tour_property/${key}.svg`}
                        alt=""
                      />
                      <p className={styles.tour_property__title}>
                        {value.name}
                        <span> {value.title}</span>
                      </p>
                    </div>
                  );
                })}
            </div>
            <div className={styles.hotel_descr_wrapper}>
              <h4 className={styles.hotel_descr_title}>Описание отеля</h4>
              <ReadMore />
            </div>
          </div>
        </div>
        {data.offer && (
          <TurDetails data={data} country={hotel.t.n} hotel={hotel} />
        )}
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const data = ctx.query;
  const loc = languagesOperatorApi[ctx.locale];

  function splitUrlString(str) {
    let separatorIndex = str.indexOf('-');
    if (separatorIndex === -1) {
      return [str];
    } else {
      let firstPart = str.slice(0, separatorIndex);
      let secondPart = str.slice(separatorIndex + 1);
      separatorIndex = secondPart.indexOf('-');
      if (separatorIndex === -1) {
        return [firstPart, secondPart];
      } else {
        let thirdPart = secondPart.slice(separatorIndex + 1);
        secondPart = secondPart.slice(0, separatorIndex);
        return [firstPart, secondPart, thirdPart];
      }
    }
  }

  const result = splitUrlString(data.hotel);
  const countryId = result[0];
  const hotelId = result[1];
  const hotelName = result[2];

  data.hotelId = hotelId;

  let hotel;
  try {
    hotel = await fetch(
      `http://localhost:3000/api/endpoints/hotels?hotelId=${hotelId}&locale=${loc}`
    ).then((response) => {
      if (response.status === 200) {
        if (response.ok) {
          return response.json();
        } else {
          return null;
        }
      }
      return null;
    });
  } catch (error) {
    hotel = null;
  }

  return {
    props: {
      data,
      hotel: hotel?.result?.hotel ? hotel?.result?.hotel : null,
    },
  };
}
