import TouchCarousel from 'react-touch-carousel';
import touchWithMouseHOC from 'react-touch-carousel/lib/touchWithMouseHOC';
import NonPassiveTouchTarget from './nonPassiveTouchTarget'; /* ios fix */
import { bcCardsWidth } from '/utils/constants';
import Image from 'next/image';
import styles from './carousel.module.css';
import Link from 'next/link';

export default function Carousel({ data }) {
  const cardSize = bcCardsWidth.cardSize;

  const shimmer = (w, h) => `
  <svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#53536e" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#53536e" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#53536e" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

  const toBase64 = (str) =>
    typeof window === 'undefined'
      ? Buffer.from(str).toString('base64')
      : window.btoa(str);

  function CarouselContainer(props) {
    const {
      cursor,
      carouselState: { active, dragging },
      ...rest
    } = props;

    let current = -Math.round(cursor) % data.length;
    while (current < 0) {
      current += data.length;
    }

    const translateX = cursor * cardSize + 20;

    let classes = '';
    if (active) {
      classes = 'is-active';
    }
    if (dragging) {
      classes = 'is-dragging';
    }
    if (active && dragging) {
      classes = 'is-active is-dragging';
    }
    return (
      <NonPassiveTouchTarget
        className={`${styles.carousel_container} ${classes}`}
      >
        <NonPassiveTouchTarget
          className={styles.carousel_track}
          style={{ transform: `translate3d(${translateX}px, 0, 0)` }}
          {...rest}
        />
      </NonPassiveTouchTarget>
    );
  }

  // need for mouse drag
  const Container = touchWithMouseHOC(CarouselContainer);

  function renderCard(index, modIndex) {
    const item = data[modIndex];

    return (
      <div key={index} className={styles.carousel_card}>
        <Link href={item.link}>
          <a>
            <div
              className={styles.carousel_card_inner}
              // style={{ backgroundImage: `url(${item.image})` }}
              // style={{ backgroundColor: item.txt_background }}
            >
              <Image
                src={item.image}
                alt="Picture of the author"
                width={290}
                height={370}
                layout="responsive" //to fix blur, but bigger img size
                objectFit="cover"
                objectPosition="center"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(290, 290)
                )}`}
                quality="100"
              />
              <div className={styles.carousel_text_content}>
                <div
                  className={styles.carousel_text}
                  style={{ background: item.txt_background }}
                >
                  <h3>{item.title}</h3>
                  <span>{item.price}</span>
                </div>
                {item.badge && (
                  <span className={styles.carousel_badge}>{item.badge}</span>
                )}
              </div>
            </div>
          </a>
        </Link>
      </div>
    );
  }

  return (
    <TouchCarousel
      component={Container}
      cardSize={cardSize}
      cardCount={data.length}
      loop={false}
      renderCard={renderCard}
    />
  );
}
