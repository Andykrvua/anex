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
  // image: min-width 691, min-height 380
  return (
    <div key={index} className={styles.card}>
      <Link href={item.link}>
        <a>
          <div className={styles.card_inner}>
            <Image
              src={item.image}
              alt={item.title}
              // width={290}
              // height={380}
              // layout="responsive" //to fix blur, but bigger img size
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(290, 380)
              )}`}
              quality="100"
            />
            <div className={styles.card_text_content}>
              <div
                className={item.lastCard ? styles.last_card : styles.card_text}
                style={item.txt_bg ? { background: item.txt_bg } : {}}
              >
                <h3>{item.title}</h3>
                <span>{item.price}</span>
              </div>
              {item.badge && (
                <span
                  className={styles.card_badge}
                  style={{ background: item.badge_bg }}
                >
                  {item.badge}
                </span>
              )}
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
};

const MemoizedCard = memo(Card);

export default function Carousel({ data, instance }) {
  const cardSize = bcCardsWidth.cardSize;

  function CarouselContainer(props) {
    const size = viewPortSize();
    const [carousel, setCarousel] = useState(false);
    const {
      cursor,
      carouselState: { active, dragging },
      ...rest
    } = props;

    useLayoutEffect(() => {
      if (size.width >= 810) {
        setCarousel(false);
      } else {
        setCarousel(true);
      }
    }, [size]);

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
        className={
          carousel
            ? `${styles.cards_container} ${classes}`
            : `${styles.cards_container}`
        }
      >
        <NonPassiveTouchTarget
          className={`${styles.cards_track} ${styles[instance]}`}
          style={
            carousel ? { transform: `translate3d(${translateX}px, 0, 0)` } : {}
          }
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
