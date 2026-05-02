import { useEffect, useRef } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import styles from './v2cards.module.css';

const formatPrice = (uah) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(uah);

/**
 * Popover с историей цены для одного nights-слота.
 * Рендерится только когда `open=true`. Закрывается по клику вне.
 *
 * Данные:
 *   - currentOffer: Offer | null — то, что сейчас в hotel.offers[nights]
 *   - currentSnapshot: number — hotel.lastUpdatedSnapshot
 *   - history: Array<{ offer: Offer, snapshotVersion: number }> — вытесненные
 *     при price_drop, отсортированы от старейшего к свежему-вытесненному.
 */
export default function PriceHistoryPopover({
  open,
  onClose,
  nights,
  currentOffer,
  currentSnapshot,
  history,
}) {
  const popoverRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const handler = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    // Defer to next tick — иначе сам клик, открывший popover, его закроет.
    const id = setTimeout(() => {
      document.addEventListener('mousedown', handler);
      document.addEventListener('touchstart', handler);
    }, 0);
    return () => {
      clearTimeout(id);
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [open, onClose]);

  if (!open) return null;

  // Свежий-вытесненный снизу массива → переворачиваем для UI: сверху самый
  // недавний "был", дальше — старее.
  const reversedHistory = [...history].reverse();

  return (
    <div ref={popoverRef} className={styles.historyPopover} role="dialog">
      <div className={styles.historyTitle}>
        <FM id="slot.history_title" values={{ nights }} />
      </div>
      <ul className={styles.historyList}>
        {currentOffer && (
          <li className={styles.historyRowCurrent}>
            <span className={styles.historyLabel}>
              <FM id="slot.history_current" />:
            </span>
            <span className={styles.historyPrice}>
              {formatPrice(currentOffer.pl)}
            </span>
            {currentSnapshot != null && (
              <span className={styles.historyBatch}>
                <FM
                  id="slot.history_at_batch"
                  values={{ n: currentSnapshot }}
                />
              </span>
            )}
          </li>
        )}
        {reversedHistory.map((entry) => (
          <li
            key={`${entry.offer.i}-${entry.snapshotVersion}`}
            className={styles.historyRow}
          >
            <span className={styles.historyLabel}>
              <FM id="slot.history_was" />:
            </span>
            <span className={styles.historyPrice}>
              {formatPrice(entry.offer.pl)}
            </span>
            <span className={styles.historyBatch}>
              <FM
                id="slot.history_at_batch"
                values={{ n: entry.snapshotVersion }}
              />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
