import { useState } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import { useSearchSession, useUnviewedUpdatesCount } from 'store/searchStore';
import styles from './UpdatesBanner.module.css';

/**
 * Sticky-баннер сводки. Появляется при увеличении `snapshotVersion`,
 * если есть unviewed updates. Скрывается по клику `×` (локально, до
 * следующего ingest-а) или автоматически когда `selectUnviewedCount === 0`.
 *
 *   - "+{newHotels} новых отелей · {others} обновлений на других страницах"
 *   - "{others} обновлений на других страницах" — если новых отелей нет
 *   - "+{newHotels} новых отелей" — если все остальные на текущей странице
 *   - Если все updates на текущей странице и нет new_hotel → не показываем
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
