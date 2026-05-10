import { useState } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import { useSearchSession, useUnviewedUpdatesCount } from 'store/searchStore';
import styles from './UpdatesBanner.module.css';

/**
 * Summary banner. Appears when `snapshotVersion` increases
 * and there are unviewed updates. Dismissed by clicking `×` (locally, until
 * the next ingest) or automatically when `selectUnviewedCount === 0`.
 *
 *   - "+{newHotels} new hotels · {others} updates on other pages"
 *   - "{others} updates on other pages" — if there are no new hotels
 *   - "+{newHotels} new hotels" — if all others are on the current page
 *   - If all updates are on the current page and there is no new_hotel → don't show
 *
 * @param {{ hotelsOnPage: Array, onShowDetails: () => void }} props
 */
export default function UpdatesBanner({ hotelsOnPage = [], onShowDetails }) {
  const session = useSearchSession();
  const unviewedCount = useUnviewedUpdatesCount();
  const [dismissedAtVersion, setDismissedAtVersion] = useState(0);

  if (unviewedCount === 0) return null;
  if (dismissedAtVersion >= session.snapshotVersion) return null;

  const onPageIds = new Set(hotelsOnPage.map((h) => String(h.i)));
  let newHotelsCount = 0;
  let othersCount = 0;
  for (const u of session.updates) {
    if (session.viewedUpdateIds.has(u.id)) continue;
    if (u.type === 'new_hotel') newHotelsCount += 1;
    if (!onPageIds.has(u.hotelId)) othersCount += 1;
  }

  let messageKey;
  let values;
  if (newHotelsCount > 0 && othersCount > 0) {
    messageKey = 'banner.summary_full';
    values = { newHotels: newHotelsCount, others: othersCount };
  } else if (newHotelsCount > 0) {
    messageKey = 'banner.summary_new_only';
    values = { newHotels: newHotelsCount };
  } else if (othersCount > 0) {
    messageKey = 'banner.summary_updates_only';
    values = { others: othersCount };
  } else {
    return null;
  }

  return (
    <div className={styles.banner} role="status">
      <span className={styles.text}>
        <FM id={messageKey} values={values} />
      </span>
      <button
        type="button"
        className={styles.detailsBtn}
        onClick={onShowDetails}
      >
        <FM id="banner.action_details" />
      </button>
      <button
        type="button"
        className={styles.closeBtn}
        onClick={() => setDismissedAtVersion(session.snapshotVersion)}
      >
        <FM id="banner.action_close" />
      </button>
    </div>
  );
}
