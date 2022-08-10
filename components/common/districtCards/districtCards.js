import styles from './districtCards.module.css';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import { GetLangField } from '/utils/getLangField';
import Link from 'next/link';
import { links } from 'utils/links';

export default function TourCards({ current, cards, country, loc }) {
  return (
    <div className={styles.cards_wrapper}>
      {cards.map((item, ind) => {
        return (
          <Link
            href={`${links.countries}/${country}/${item.subpage_slug}`}
            key={ind}
          >
            <a
              style={
                current === 'popular' && !item.popular
                  ? { display: 'none' }
                  : {}
              }
            >
              <span className={styles.card} key={item.id}>
                <Image
                  className={styles.img}
                  src={`${process.env.NEXT_PUBLIC_API_img}${item.img}`}
                  alt=""
                  layout="responsive"
                  width={333}
                  height={250}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(333, 250)
                  )}`}
                  objectFit="cover"
                  quality="100"
                />
                <p className={styles.card_name}>
                  <img src="/assets/img/svg/palm-tree.svg" alt="" />
                  {GetLangField(
                    item.translations,
                    'languages_code',
                    'name',
                    loc
                  )}
                </p>
              </span>
            </a>
          </Link>
        );
      })}
    </div>
  );
}
