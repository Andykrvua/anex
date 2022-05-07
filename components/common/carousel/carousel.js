import TouchCarousel from 'react-touch-carousel';
import touchWithMouseHOC from 'react-touch-carousel/lib/touchWithMouseHOC';
import NonPassiveTouchTarget from './nonPassiveTouchTarget'; /* ios fix */
import { bcCardsWidth } from '/utils/constants';
import Image from 'next/image';

export default function Carousel({ data }) {
  const cardSize = bcCardsWidth.cardSize;

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

    let classes = 'carousel-container';
    if (active) {
      classes = 'carousel-container is-active';
    }
    if (dragging) {
      classes = 'carousel-container is-dragging';
    }
    if (active && dragging) {
      classes = 'carousel-container is-active is-dragging';
    }
    return (
      <NonPassiveTouchTarget className={classes}>
        <NonPassiveTouchTarget
          className="carousel-track"
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
      <div key={index} className="carousel-card">
        {/* <img src={item.image} alt="" /> */}

        <div
          className="carousel-card-inner"
          style={{ backgroundImage: `url(${item.image})` }}
          // style={{ backgroundColor: item.txt_background }}
        >
          {/* <Image
            src={item.image}
            alt="Picture of the author"
            width={290}
            height={290}
            layout="responsive"
            objectFit="cover"
          /> */}
          <div className="carousel-title">{item.title}</div>
          <div className="carousel-text">{item.text}</div>
        </div>
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
