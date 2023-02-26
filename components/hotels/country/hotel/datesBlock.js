import styles from './turDetails.module.css';

export default function DurationBlock({ offerData }) {
  // const dStart = new Date(offerData.d);
  // {dStart.toLocaleDateString('uk-UA', opt)}
  const opt = {
    day: 'numeric',
    month: 'short',
  };

  return (
    <div className={styles.dates_block} style={{ width: '800px' }}>
      <div>11</div>
    </div>
  );
}
