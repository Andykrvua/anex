import styles from './turDetails.module.css';
import { FormattedMessage as FM } from 'react-intl';

export default function TransportBlock({ offerData, country, data }) {
  if (process.env.NODE_ENV === 'development') {
    console.log('offerData', offerData);
  }
  if (offerData?.t === 'bus') {
    return (
      <>
        <div className={styles.transport_block_min_2items}>
          {data.fromname} → {country}
        </div>
        <div className={styles.transport_block_min_2items}>
          {country} → {data.fromname}
        </div>
      </>
    );
  }

  if (offerData?.t === 'no') {
    return (
      <div className={styles.transport_block_min_1items}>
        <FM id="common.tr_no" />
      </div>
    );
  }

  if (offerData?.t === 'air') {
    if (
      (offerData.to && typeof offerData?.to['from'] === 'undefined') ||
      (offerData.to && typeof offerData?.to['to'] === 'undefined') ||
      !offerData?.to?.from[0]?.begin
    ) {
      return (
        <>
          <div className={styles.transport_block_min_2items}>
            {data.fromname} → {country}
          </div>
          <div className={styles.transport_block_min_2items}>
            {country} → {data.fromname}
          </div>
        </>
      );
    } else {
      const fromBegin = new Date(offerData?.to?.from[0]?.begin);
      const fromEnd = new Date(offerData?.to?.from[0]?.end);
      const toBegin = new Date(offerData?.to?.to[0]?.begin);
      const toEnd = new Date(offerData?.to?.to[0]?.end);
      const optBegin = {
        day: 'numeric',
        month: 'short',
        hour: 'numeric',
        minute: 'numeric',
      };
      const optEnd = {
        hour: 'numeric',
        minute: 'numeric',
      };

      return (
        <div className={styles.transport_block}>
          <div>
            {offerData.to.from?.length > 0 && (
              <>
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="var(--primary)"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M18.8 9.6a1.537 1.537 0 0 0-1.2-1.9l-5.7-1.9L9.8 0H8.6l-.1 4.7-4.9-1.9L2.9.4 2 .1l-.7 5 15.3 5.3a1.65 1.65 0 0 0 2.2-.8ZM1 14h18v2H1v-2Z"></path>
                </svg>
                <div className={styles.transport_block_from_to}>
                  <div>
                    <span className={styles.transport_block_from_to_airlines}>
                      {offerData.to.from?.[0]?.line}
                    </span>{' '}
                    {data.fromname} → {country}
                  </div>
                  <div>
                    {fromBegin.toLocaleDateString('uk-UA', optBegin)} →{' '}
                    {fromEnd.toLocaleTimeString('uk-UA', optEnd)}
                  </div>
                  <div className={styles.craft_code}>
                    Рейс {offerData.to.from?.[0]?.code} {offerData.to.from?.[0]?.craft}
                  </div>
                </div>
              </>
            )}
          </div>
          <div>
            {offerData.to.to?.length > 0 && (
              <>
                {' '}
                <svg
                  width="20"
                  height="16"
                  viewBox="0 0 20 16"
                  fill="var(--primary)"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M1 14h18v2H1v-2ZM19.4 3.7a1.607 1.607 0 0 0-2-1l-5.8 1.5-5-3.7-1 .6 2.4 4-5 1.3-1.9-1.7-1 .2 2.3 4.7 15.7-4.1a1.464 1.464 0 0 0 1.3-1.8Z"></path>
                </svg>
                <div className={styles.transport_block_from_to}>
                  <div>
                    <span className={styles.transport_block_from_to_airlines}>
                      {offerData.to.to?.[0]?.line}
                    </span>{' '}
                    {country} → {data.fromname}
                  </div>
                  <div>
                    {toBegin.toLocaleDateString('uk-UA', optBegin)} →{' '}
                    {toEnd.toLocaleTimeString('uk-UA', optEnd)}
                  </div>
                  <div className={styles.craft_code}>
                    Рейс {offerData.to.to?.[0]?.code} {offerData.to.to?.[0]?.craft}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }
  }

  return <div>-</div>;
}
