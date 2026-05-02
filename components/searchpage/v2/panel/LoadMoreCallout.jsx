import { FormattedMessage as FM } from 'react-intl';
import { useSearchSession } from 'store/searchStore';
import styles from './UpdatesPanel.module.css';

/**
 * Callout под пагинацией: показывается, когда на ТЕКУЩЕЙ странице нет
 * unviewed updates, но они есть на других страницах. Подсказывает юзеру
 * открыть `<UpdatesPanel />`, чтобы перейти к карточкам с обновлениями.
 */
export default function LoadMoreCallout({ hotelsOnPage = [], onOpenPanel }) {
  const session = useSearchSession();

  const onPageIds = new Set(hotelsOnPage.map((h) => String(h.i)));
  let onPageHasUnviewed = false;
  let othersCount = 0;
  for (const u of session.updates) {
    if (session.viewedUpdateIds.has(u.id)) continue;
    if (onPageIds.has(u.hotelId)) onPageHasUnviewed = true;
    else othersCount += 1;
  }

  if (onPageHasUnviewed) return null;
  if (othersCount === 0) return null;

  return (
    <div className={styles.callout}>
      <span>
        <FM id="updates.callout_below" values={{ count: othersCount }} />
      </span>
      <button
        type="button"
        className={styles.calloutBtn}
        onClick={onOpenPanel}
      >
        <FM id="updates.callout_open" />
      </button>
    </div>
  );
}
