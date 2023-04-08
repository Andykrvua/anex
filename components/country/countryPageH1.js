import styles from './countryPageH1.module.css';

export default function countryPageH1({ children }) {
  return <h2 className={styles.title}>{children}</h2>;
}
