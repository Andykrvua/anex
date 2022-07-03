import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import styles from './post.module.css';
import { directusFormattedDate } from 'utils/formattedDate';
import { GetLangField } from 'utils/getLangField';

export default function Post({ post, loc }) {
  return (
    <article className={styles.post}>
      <header className={styles.header}>
        <div className={styles.img_wrapper}>
          <Image
            className={styles.img}
            src={`https://a-k.name/directus/assets/${post.img}`}
            alt=""
            layout="fill"
            objectFit="cover"
            objectPosition="center"
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${toBase64(
              shimmer(333, 360)
            )}`}
            quality="100"
            priority={true}
          />
        </div>
        <div className={styles.header_text}>
          <div className={styles.header_text_wrapper}>
            <h1 className={styles.title}>{post.translations[0].title}</h1>
            {post?.categories?.[0] && (
              <span
                className={styles.category}
                style={{
                  backgroundColor: post.categories[0].categories_id.bg_color,
                }}
              >
                {GetLangField(
                  post.categories[0].categories_id.translations,
                  'languages_id',
                  'name',
                  loc
                )}
              </span>
            )}

            <span className={styles.date}>
              {directusFormattedDate(post.date_created)}
            </span>
          </div>
        </div>
      </header>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: post.translations[0].content }}
      />
    </article>
  );
}
