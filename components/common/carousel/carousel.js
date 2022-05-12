import TouchCarousel from 'react-touch-carousel';
import touchWithMouseHOC from 'react-touch-carousel/lib/touchWithMouseHOC';
import NonPassiveTouchTarget from './nonPassiveTouchTarget'; /* ios fix */
import { bcCardsWidth } from '/utils/constants';
import Image from 'next/image';
import styles from './carousel.module.css';
import Link from 'next/link';
import { memo } from 'react';
import { shimmer, toBase64 } from '/utils/blurImage';
import viewPortSize from '/utils/getViewport';
import { useState, useLayoutEffect } from 'react';

const Card = ({ index, item }) => {
  return (
    <div key={index} className={styles.carousel_card}>
      <Link href={item.link}>
        <a>
          <div className={styles.carousel_card_inner}>
            <Image
              src={item.image}
              alt={item.title}
              width={290}
              height={380}
              layout="responsive" //to fix blur, but bigger img size
              objectFit="cover"
              objectPosition="center"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(290, 380)
              )}`}
              quality="100"
            />
            <div className={styles.carousel_text_content}>
              <div
                className={item.price ? styles.carousel_text : styles.last_card}
                style={
                  item.txt_background ? { background: item.txt_background } : {}
                }
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
};

const MemoizedCard = memo(Card);

export default function Carousel({ data }) {
  const size = viewPortSize();
  console.log(size);
  const [carousel, setCarousel] = useState(true);

  useLayoutEffect(() => {
    if (size.width >= 810) {
      setCarousel(false);
    } else {
      setCarousel(true);
    }
  }, [carousel]);

  const cardSize = bcCardsWidth.cardSize;

  function CarouselContainer(props) {
    const {
      cursor,
      carouselState: { active, dragging },
      ...rest
    } = props;

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

    return <MemoizedCard index={index} item={item} />;
  }
  console.log('render');

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
