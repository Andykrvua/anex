import TouchCarousel from 'react-touch-carousel';
import touchWithMouseHOC from 'react-touch-carousel/lib/touchWithMouseHOC';
import NonPassiveTouchTarget from './nonPassiveTouchTarget'; /* ios fix */
import { bcCardsWidth, carouselInstance } from '/utils/constants';
import Image from 'next/image';
import styles from './carousel.module.css';
import Link from 'next/link';
import { memo } from 'react';
import { shimmer, toBase64 } from '/utils/blurImage';
import viewPortSize from '/utils/getViewport';
import { useState, useLayoutEffect } from 'react';
import { useIntl } from 'react-intl';

const Card = ({ index, item, instance, minOffer }) => {
  const intl = useIntl();
  if (minOffer && instance === carouselInstance.popularCountry) {
    const temp = minOffer.filter((country) => item.code === country.iso);
    item.price = temp.length ? temp[0].uah : null;
  }

  return (
    <div key={index} className={styles.card}>
      <Link href={item.lastCard ? `/${instance}` : `/${instance}/${item.slug}`}>
        <a>
          <div className={styles.card_inner}>
            <Image
              src={
                item.lastCard
                  ? item.img
                  : `${process.env.NEXT_PUBLIC_API_img}${
                      instance === carouselInstance.popularCountry
                        ? item.popular_img
                        : item.img
                    }`
              }
              // src={item.image}
              // alt={item.title}
              alt=""
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(
                shimmer(290, 380)
              )}`}
            />
            <div className={styles.card_text_content}>
              <div
                className={item.lastCard ? styles.last_card : styles.card_text}
                style={
                  instance === carouselInstance.blog || item.lastCard
                    ? {}
                    : { background: item.name_color || 'var(--green-badge)' }
                }
              >
                <h3>
                  {item.title ||
                    item.translations[0].name ||
                    item.translations[0].title}
                </h3>
                {instance === carouselInstance.popularCountry && item.price ? (
                  <span>
                    {item.lastCard
                      ? ''
                      : `${intl.formatMessage({ id: 'common.ot' })} ${item.price.toLocaleString()} грн`}
                  </span>
                ) : null}
              </div>
              {item.categories?.length && (
                <span
                  className={styles.card_badge}
                  style={{
                    background:
                      item.categories[0].categories_id.bg_color ||
                      'var(--green-badge)',
                  }}
                >
                  {item.categories[0].categories_id.translations[0].name}
                </span>
              )}
              {item.badge_color && (
                <span
                  className={styles.card_badge}
                  style={{
                    background: item.badge_color || 'var(--green-badge)',
                  }}
                >
                  {item.translations[0].badge}
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

export default function Carousel({ data, instance, minOffer }) {
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

    return (
      <MemoizedCard
        index={index}
        item={item}
        instance={instance}
        minOffer={minOffer}
        length={data.length}
      />
    );
  }

  return (
    <div className={styles.carousel_wrapper}>
      <TouchCarousel
        component={Container}
        cardSize={cardSize}
        cardCount={data.length}
        loop={false}
        renderCard={renderCard}
      />
    </div>
  );
}
