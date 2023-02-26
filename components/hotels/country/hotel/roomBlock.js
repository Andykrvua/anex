import styles from './turDetails.module.css';
import { food } from 'utils/constants';
import { FormattedMessage as FM } from 'react-intl';

export default function RoomBlock({ offerData }) {
  return (
    <>
      <svg
        width="28"
        height="28"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 15C12.1046 15 13 14.1046 13 13C13 11.8954 12.1046 11 11 11C9.89543 11 9 11.8954 9 13C9 14.1046 9.89543 15 11 15Z"
          fill="var(--primary)"
        />
        <path
          d="M18.9243 8.85714H14.5C14.2746 8.85714 14.0584 8.94745 13.899 9.10819C13.7396 9.26894 13.65 9.48696 13.65 9.71429V15.7143H7.7V8H6V20H7.7V17.4286H21.3V20H23V12.9671C22.9989 11.8775 22.5691 10.8327 21.805 10.0622C21.0409 9.29166 20.0049 8.85828 18.9243 8.85714ZM15.35 15.7143V10.5714H18.9243C19.5541 10.5721 20.158 10.8247 20.6034 11.2739C21.0488 11.723 21.2993 12.332 21.3 12.9671V15.7143H15.35Z"
          fill="var(--primary)"
        />
      </svg>
      <div className={styles.room_block}>
        <span className={styles.room_block_bold}>{offerData?.r}</span>
        <span className={styles.room_block_food}>
          Питание:{' '}
          <span className={styles.room_block_bold}> {offerData?.fn}</span> (
          <FM id={food[offerData?.f]} />)
        </span>
      </div>
    </>
  );
}
