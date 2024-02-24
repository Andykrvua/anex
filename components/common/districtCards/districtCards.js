import styles from './districtCards.module.css';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import { GetLangField } from '/utils/getLangField';
import Link from 'next/link';
import { links } from 'utils/links';
import { location } from 'utils/constants';
import { FormattedMessage as FM } from 'react-intl';
import { useRouter } from 'next/router';

export default function TourCards({ current, cards, country, loc, variant = null }) {
  const router = useRouter();

  const getLink = (item) => {
    if (variant === location.districtList.allToursPage) {
      return `${links.tours}/${item.slug}`;
    } else if (variant === location.districtList.busToursPage) {
      return `${links.tours}/${item.slug}/${item.subpage}${item.subsubpage ? '/' + item.subsubpage : ''}`;
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
            <a
              style={
                current === 'popular' && !item.popular && variant !== location.districtList.busToursPage
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
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(333, 250))}`}
                  objectFit="cover"
                />
                <p className={styles.card_name}>
                  <img src="/assets/img/svg/palm-tree.svg" alt="" />
                  <span>
                    {/* {variant === location.districtList.busToursPage && !router.query.subpage && (
                      <FM id="country.from_1" />
                    )}
                    {variant === location.districtList.busToursPage && router.query.subpage && (
                      <FM id="country.tours_from" />
                    )}{' '} */}
                    {GetLangField(item.translations, 'languages_code', 'name', loc)}
                  </span>
                </p>
              </span>
            </a>
          </Link>
        );
      })}
    </div>
  );
}
