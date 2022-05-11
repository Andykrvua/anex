import styles from './popCountryDesctopContent.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';

export default function PopCountryDesctopContent({ data }) {
  console.log('render');
  return (
    <div className={styles.popcountry_desktop}>
      {data.map((item, index) => {
        return (
          <div key={index} className={styles.carousel_card}>
            <Link href={item.link}>
              <a>
                <div className={styles.carousel_card_inner}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    // width={333}
                    // height={380}
                    layout="fill" //to fix blur, but bigger img size
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
                      className={
                        item.price ? styles.carousel_text : styles.last_card
                      }
                      style={{ background: item.txt_background }}
                    >
                      <h3>{item.title}</h3>
                      <span>{item.price}</span>
                    </div>
                    {item.badge && (
                      <span className={styles.carousel_badge}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            </Link>
          </div>
        );
      })}
    </div>
  );
}