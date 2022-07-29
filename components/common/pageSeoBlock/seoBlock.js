import styles from './seoBlock.module.css';

export default function SeoBlock({ text }) {
  return (
    <div
      className={styles.seoblock}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
}
