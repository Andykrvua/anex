import styles from './checkbox.module.css';

export default function Checkbox({ label, check, setCheck }) {
  return (
    <label className={styles.checkbox_container}>
      {label}
      <input
        type="checkbox"
        // defaultChecked={check}
        checked={check}
        onChange={() => setCheck(!check)}
      />
      <span className={styles.checkmark}>
        <svg
          width="11"
          height="10"
          viewBox="0 0 11 10"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1 6L4.5 8.5L9.5 1.5"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </label>
  );
}
