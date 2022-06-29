import styles from './postList.module.css';
import { directusFormattedDate } from 'utils/formattedDate';
import { GetLangField } from 'utils/getLangField';
import Link from 'next/link';
import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import { links } from 'utils/links';

export default function PostList({ data, loc }) {
  return (
    <div className={styles.post_list}>
      {data?.map((item, ind) => (
        <div key={ind} className={styles.post}>
          <Link href={`${links.blog}/${item.slug}`}>
            <a className={styles.link}>
              <Image
                className={styles.img}
                src={`https://a-k.name/directus/assets/${item.img}`}
                alt=""
                layout="fill"
                objectFit="cover"
                objectPosition="center"
                placeholder="blur"
                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                  shimmer(333, 360)
                )}`}
                quality="100"
                priority={ind === 0 ? true : false}
              />
              {item.categories[0] && (
                <span
                  className={styles.category}
                  style={{
                    backgroundColor: item.categories[0].categories_id.bg_color,
                  }}
                >
                  {GetLangField(
                    item.categories[0].categories_id.translations,
                    'languages_id',
                    'name',
                    loc
                  )}
                </span>
              )}

              <span className={styles.date}>
                {directusFormattedDate(item.date_created)}
              </span>
              <h3 className={styles.title}>
                {GetLangField(
                  item.translations,
                  'languages_code',
                  'title',
                  loc
                )}
              </h3>
            </a>
          </Link>
        </div>
      ))}
    </div>
  );
}
