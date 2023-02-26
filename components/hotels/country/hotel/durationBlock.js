import styles from './turDetails.module.css';

export default function DurationBlock({ offerData }) {
  const dStart = new Date(offerData?.d);
  const dEnd = new Date(offerData?.dt);

  const opt = {
    day: 'numeric',
    month: 'short',
  };

  return (
    <>
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="var(--primary)"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M19.5 3h-3V1.5H15V3H9V1.5H7.5V3h-3A1.502 1.502 0 0 0 3 4.5v15A1.501 1.501 0 0 0 4.5 21h15a1.502 1.502 0 0 0 1.5-1.5v-15A1.502 1.502 0 0 0 19.5 3Zm-15 1.5h3V6H9V4.5h6V6h1.5V4.5h3v3h-15v-3Zm0 4.5h3.75v4.5H4.5V9Zm9.75 10.5h-4.5V15h4.5v4.5Zm0-6h-4.5V9h4.5v4.5Zm1.5 6V15h3.75v4.5h-3.75Z"></path>
      </svg>
      <div className={styles.duration_block}>
        <div className={styles.duration_block_title}>
          {dStart.toLocaleDateString('uk-UA', opt)} -{' '}
          {dEnd.toLocaleDateString('uk-UA', opt)}
        </div>
        <div>
          {offerData?.n} дней / {offerData?.nh} ночей
        </div>
      </div>
    </>
  );
}
