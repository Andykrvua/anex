import Image from 'next/image';
import { shimmer, toBase64 } from '/utils/blurImage';
import styles from './post.module.css';
import { directusFormattedDate } from 'utils/formattedDate';
import { GetLangField } from 'utils/getLangField';
import { location } from 'utils/constants';
import Faq from '/components/country/faq.js';
import changeImageUrl from 'utils/changeImageUrl';
import { FormattedMessage as FM } from 'react-intl';

// variant null = post content
// variant countryPage = country page post content
// variant tourPage = tour page post content
export default function Post({ post, loc, variant = null, minOffer = null, tours = null }) {
  const content = changeImageUrl(post, variant);

  return (
    <article className={`${styles.post} ${styles[variant]}`}>
      {variant === location.postContent.countryPage && (
        <h2 className={styles.countrypage_title}>{post.translations[0].post_title}</h2>
      )}
      {variant === location.postContent.tourPage ? null : (
        <header className={styles.header}>
          <div className={`${styles.img_wrapper} ${styles[variant]}`}>
            <Image
              className={styles.img}
              src={`${process.env.NEXT_PUBLIC_API_img}${post.img}`}
              alt=""
              layout="fill"
              objectFit="cover"
              objectPosition="center"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(333, 360))}`}
              priority={true}
            />
            {variant === location.postContent.countryPage && !tours && post.translations[0].badge ? (
              <p className={styles.badge}>{post.translations[0].badge}</p>
            ) : null}
            {variant === location.postContent.countryPage && post.translations[0].name && (
              <div className={styles.card_text}>
                <h3>{tours ? post.translations[0].badge : post.translations[0].name}</h3>
                {minOffer && (
                  <span>
                    <FM id="common.ot" />
                    {` ${minOffer.toLocaleString()} грн`}
                  </span>
                )}
              </div>
            )}
          </div>
          <div className={styles.header_text}>
            <div className={`${styles.header_text_wrapper} ${styles[variant]}`}>
              {variant === null ? (
                <h1 className={styles.title}>{post.translations[0].title}</h1>
              ) : (
                <h1 className={`${styles.title} ${styles[variant]}`}>{post.translations[0].post_title}</h1>
              )}
              {post?.categories?.[0] && (
                <span
                  className={styles.category}
                  style={{
                    backgroundColor: post.categories[0].categories_id.bg_color,
                  }}
                >
                  {GetLangField(post.categories[0].categories_id.translations, 'languages_id', 'name', loc)}
                </span>
              )}

              {variant === null && (
                <span className={styles.date}>{directusFormattedDate(post.date_created)}</span>
              )}
            </div>
          </div>
        </header>
      )}
      {post.translations[0].faq && <Faq data={post.translations[0].faq} />}
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: content,
        }}
      />
    </article>
  );
}
