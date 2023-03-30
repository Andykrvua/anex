import styles from './cards.module.css';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import { GetLangField } from '/utils/getLangField';
import Link from 'next/link';
import { links } from '/utils/links';

export default function Cards({ countryList, loc }) {
  countryList.data.sort((a, b) =>
    a.date_created > b.date_created
      ? 1
      : b.date_created > a.date_created
      ? -1
      : 0
  );
  return (
    <div className={styles.cards}>
      {countryList.data.map((country) => {
        return (
          <div className={styles.card} key={country.slug}>
            <Link href={`${links.countries}/${country.slug}`}>
              <a>
                <Image
                  className={styles.img}
                  src={`${process.env.NEXT_PUBLIC_API_img}${country.img}`}
                  alt=""
                  layout="responsive"
                  width={333}
                  height={250}
                  placeholder="blur"
                  blurDataURL={`data:image/svg+xml;base64,${toBase64(
                    shimmer(333, 250)
                  )}`}
                />
              </a>
            </Link>
            <div className={styles.name}>
              {GetLangField(
                country.translations,
                'languages_code',
                'name',
                loc
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
