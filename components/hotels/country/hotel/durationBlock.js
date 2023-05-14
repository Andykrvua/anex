import styles from './turDetails.module.css';
import { dayMonthFormatDate } from 'utils/formattedDate';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';
import declension from 'utils/declension';

export default function DurationBlock({ offerData }) {
  const dStart = new Date(offerData?.d);
  const dEnd = new Date(offerData?.dt);

  const router = useRouter();

  const intl = useIntl();
  // const dTxt1 = intl.formatMessage({
  //   id: 'common.day1',
  // });
  // const dTxt2 = intl.formatMessage({
  //   id: 'common.day2',
  // });
  // const dTxt5 = intl.formatMessage({
  //   id: 'common.day5',
  // });

  const tTxt1 = intl.formatMessage({
    id: 'common.night1',
  });
  const tTxt2 = intl.formatMessage({
    id: 'common.night2',
  });
  const tTxt5 = intl.formatMessage({
    id: 'common.night5',
  });

  const decl = (val) => declension(val, tTxt1, tTxt2, tTxt5);

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
          {dayMonthFormatDate(dStart, router.locale)} -{' '}
          {dayMonthFormatDate(dEnd, router.locale)}
        </div>
        <div>
          {offerData.nh} {decl(offerData.nh)}
          {offerData.n - offerData.nh !== 0 ? ` + ${offerData.n - offerData.nh} ${intl.formatMessage({id: 'hotel_card.tour_time'})}` : ''}
        </div>
      </div>
    </>
  );
}
