import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import styles from './imgSlider.module.css';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import 'yet-another-react-lightbox/styles.css';

const ImgThumb = ({ img }) => {
  return (
    <Image
      className={styles.img}
      src={`https://newimg.otpusk.com/2/500x375/${img}`}
      alt=""
      layout="fill"
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(500, 375))}`}
    />
  );
};

export default function ImgSlider({ images }) {
  const [currImg, setCurrImg] = useState(0);
  const [imgThumbs, setImgThumbs] = useState([1, 2, 3, 4]);
  const [openLightbox, setOpenLightbox] = useState(false);
  const DynamicLightbox = dynamic(() => import('yet-another-react-lightbox'), {
    ssr: false,
  });
  const openLightboxHandler = async () => {
    setOpenLightbox(true);
  };
  let slides = [];
  if (images) {
    slides = images.map((item) => {
      return { src: `https://newimg.otpusk.com/2/500x375/${item.src}` };
    });
  }

  const nextImg = (e) => {
    e.stopPropagation();
    if (currImg === images.length - 1) {
      setCurrImg(0);
    } else {
      setCurrImg((prev) => prev + 1);
    }
  };
  const prevImg = (e) => {
    e.stopPropagation();
    if (currImg === 0) {
      setCurrImg(images.length - 1);
    } else {
      setCurrImg((prev) => prev - 1);
    }
  };

  useEffect(() => {
    if (currImg + 5 <= images.length - 1) {
      const arr = [];
      for (let i = currImg + 1; i < currImg + 5; i++) {
        arr.push(i);
      }
      setImgThumbs([...arr]);
    } else {
      const arr = [];
      for (let i = currImg + 1; i < currImg + 5; i++) {
        if (i > images.length - 1) {
          arr.push(i - images.length);
        } else {
          arr.push(i);
        }
      }
      setImgThumbs([...arr]);
    }
  }, [currImg]);

  return (
    <>
      <div className={styles.card_img_wrapper}>
        <div className={styles.card_img}>
          <Image
            className={styles.img}
            src={`https://newimg.otpusk.com/2/500x375/${images[currImg].src}`}
            alt=""
            layout="fill"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(500, 375)
            )}`}
          />
          <div
            className={styles.img_overlay}
            onClick={() => openLightboxHandler()}
          >
            <div className={styles.zoom_wrapper}>
              <button
                className={styles.zoom}
                onClick={() => openLightboxHandler()}
              >
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 28 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18.5 17L23.5 22L22 23.5L17 18.5V17.71L16.73 17.43C15.554 18.4439 14.0527 19.0011 12.5 19C10.7761 19 9.12279 18.3152 7.90381 17.0962C6.68482 15.8772 6 14.2239 6 12.5C6 10.7761 6.68482 9.12279 7.90381 7.90381C9.12279 6.68482 10.7761 6 12.5 6C14.2239 6 15.8772 6.68482 17.0962 7.90381C18.3152 9.12279 19 10.7761 19 12.5C19 14.11 18.41 15.59 17.43 16.73L17.71 17H18.5ZM12.5 17C15 17 17 15 17 12.5C17 10 15 8 12.5 8C10 8 8 10 8 12.5C8 15 10 17 12.5 17ZM15 13H13V15H12V13H10V12H12V10H13V12H15V13Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            <div className={styles.control_btns}>
              <button onClick={(e) => prevImg(e)}>
                <svg
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.5 1L1 6L6.5 11"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <div className={styles.control_text}>
                {currImg + 1} - {images.length}
              </div>
              <button onClick={(e) => nextImg(e)}>
                <svg
                  width="8"
                  height="12"
                  viewBox="0 0 8 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 11L6.5 6L1 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div className={styles.img_thumb}>
          {imgThumbs.map((img) => {
            return (
              <div className={styles.card_img} key={img}>
                <ImgThumb img={images[img].src} />
              </div>
            );
          })}
        </div>
      </div>

      {images && openLightbox ? (
        <DynamicLightbox
          open={openLightbox}
          index={currImg}
          close={() => setOpenLightbox(false)}
          slides={slides}
        />
      ) : null}
    </>
  );
}
