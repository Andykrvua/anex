import styles from './districtCards.module.css';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import { GetLangField } from '/utils/getLangField';
import Link from 'next/link';
import { links } from 'utils/links';
import { location } from 'utils/constants';

export default function TourCards({ current, cards, country, loc, variant = null }) {
  const getLink = (item) => {
    if (variant === location.districtList.allToursPage) {
      return `${links.tours}/${item.slug}`;
    } else {
      return `${links.countries}/${country}/${item.subsubpage_slug ? item.subpage_slug : ''}${
        item.subsubpage_slug ? '/' : ''
      }${item.subsubpage_slug ? item.subsubpage_slug : item.subpage_slug}`;
    }
  };

  return (
    <div className={styles.cards_wrapper}>
      {cards.map((item, ind) => {
        return (
          <Link href={getLink(item)} key={ind}>
            <a style={current === 'popular' && !item.popular ? { display: 'none' } : {}}>
              <span className={styles.card} key={item.id}>
                <Image
                  className={styles.img}
                  src={`${process.env.NEXT_PUBLIC_API_img}${item.img}`}
                  alt=""
                  layout="responsive"
                  width={333}
                  height={250}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(333, 250))}`}
                  objectFit="cover"
                />
                <p className={styles.card_name}>
                  <img src="/assets/img/svg/palm-tree.svg" alt="" />
                  <span>{GetLangField(item.translations, 'languages_code', 'name', loc)}</span>
                </p>
              </span>
            </a>
          </Link>
        );
      })}
    </div>
  );
}
