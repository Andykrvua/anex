import styles from './countryList.module.css';
import Cards from '/components/cards';

export default function CountryList({ countryList, loc }) {
  return (
    <section className={styles.all_country}>
      <h1 className={styles.title}>Все страны</h1>
      <Cards countryList={countryList} loc={loc} />
    </section>
  );
}
