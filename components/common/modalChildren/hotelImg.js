import styles from './hotelImg.module.css';
import { useIntl, FormattedMessage as FM } from 'react-intl';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import SimpleBar from 'simplebar-react';
import { useState, useEffect, useRef } from 'react';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';
import { useGetHotelImg } from 'store/store';
import dynamic from 'next/dynamic';
import 'yet-another-react-lightbox/styles.css';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';

export default function HotelImg() {
  const intl = useIntl();
  const useGetHotelImgData = useGetHotelImg();
  /* eslint-disable-next-line */
  const [imgs, _] = useState(useGetHotelImgData);

  const DynamicLightbox = dynamic(() => import('yet-another-react-lightbox'), {
    ssr: false,
  });

  const [openLightbox, setOpenLightbox] = useState(false);
  const [currImgIndex, setCurrImgIndex] = useState(0);

  const getCatList = () => {
    /* eslint-disable-next-line */
    const unique = new Set();
    useGetHotelImgData.forEach((el) => {
      unique.add(el.catId);
    });

    const tempArr = [];
    Array.from(unique).forEach((el) => {
      tempArr.push({
        catId: el,
        category: useGetHotelImgData.filter((item) => item.catId === el)[0].category,
      });
    });
    return tempArr;
  };
  /* eslint-disable-next-line */
  const [catList, __] = useState(getCatList());

  const scroll = useRef(null);

  useEffect(() => {
    const BODY = document.querySelector('body');
    // const SCROLLABLE = document.querySelector('.bbb');
    const SCROLLABLE = scroll.current.el;
    lock(BODY);
    unlock(SCROLLABLE);
    BODY.classList.add('iosfix');

    return () => {
      BODY.classList.remove('iosfix');
      clearBodyLocks();
    };
  }, []);

  const scrollToEl = (e, val) => {
    e.preventDefault();
    const currentScroll = document.querySelector('.scroll-container');
    const scrollEl = document.querySelector(val);
    currentScroll.scrollTo({ top: scrollEl.offsetTop - 60, behavior: 'smooth' });
  };

  const isOne = (id) => {
    if (imgs.filter((el) => el.catId === id).length === 1) return true;
  };
  const isTwo = (id) => {
    if (imgs.filter((el) => el.catId === id).length === 2) return true;
  };

  let slides = [];
  if (imgs) {
    slides = imgs.map((item) => {
      return { src: `https://newimg.otpusk.com/3_anex/1200x900/${item.src}` };
    });
  }

  const openLightboxHandler = (src) => {
    const index = imgs.findIndex((item) => item.src === src);
    setCurrImgIndex(index);
    setOpenLightbox(true);
  };

  return (
    <div ref={scroll} style={{ height: '100%' }}>
      <div className={styles.cat_list}>
        {catList.map((item, ind) => {
          return (
            <a href={`#imgId${item.catId}`} onClick={(e) => scrollToEl(e, `#imgId${item.catId}`)} key={ind}>
              {item.category}
            </a>
          );
        })}
      </div>
      <div className={`bbb`}>
        {catList.map((item, ind) => {
          return (
            <div id={`imgId${item.catId}`} key={ind}>
              <h4 className={styles.title}>{item.category}</h4>
              <div
                className={
                  isOne(item.catId)
                    ? `${styles.img_grid} ${styles.one}`
                    : isTwo(item.catId)
                    ? `${styles.img_grid} ${styles.two}`
                    : `${styles.img_grid}`
                }
              >
                {imgs.map((img, ind) => {
                  if (img.catId !== item.catId) return null;
                  return (
                    <div key={ind}>
                      <Image
                        className={styles.img}
                        src={`https://newimg.otpusk.com/2/500x375/${img.src}`}
                        alt=""
                        // layout="fill"
                        layout="responsive"
                        // objectFit="contain"
                        width={500}
                        height={375}
                        placeholder="blur"
                        blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(500, 375))}`}
                        onClick={() => openLightboxHandler(img.src)}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {imgs && openLightbox ? (
        <DynamicLightbox
          plugins={[Zoom]}
          open={openLightbox}
          index={currImgIndex}
          close={() => setOpenLightbox(false)}
          slides={slides}
          className={`${styles.lightbox} hotel-img-lightbox`}
        />
      ) : null}
    </div>
  );
}
