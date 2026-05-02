import { useMemo, useState } from 'react';
import { useSearchSession, useUnviewedUpdatesCount } from 'store/searchStore';
import styles from './DebugPanel.module.css';

/**
 * v2 debug panel (?debug=1).
 * Показывает внутреннее состояние session — для QA/devs.
 * Не локализуется (dev-only). Унаследовал стили от legacy debugPanel.module.css.
 */
export default function DebugPanel() {
  const session = useSearchSession();
  const unviewedCount = useUnviewedUpdatesCount();
  const [collapsed, setCollapsed] = useState(false);
  const [hotelIdInput, setHotelIdInput] = useState('');

  const stats = useMemo(() => {
    const hotelIds = Object.keys(session.hotelsById);
    let totalOffersCached = 0;
    const nightsDistribution = {};
    const foodDistribution = {};
    const starsDistribution = {};
    for (const id of hotelIds) {
      const h = session.hotelsById[id];
      totalOffersCached += (h.allOffers || []).length;
      starsDistribution[h.s] = (starsDistribution[h.s] || 0) + 1;
      for (const o of h.allOffers || []) {
        nightsDistribution[o.n] = (nightsDistribution[o.n] || 0) + 1;
        foodDistribution[o.f] = (foodDistribution[o.f] || 0) + 1;
      }
    }
    const updatesByType = session.updates.reduce((acc, u) => {
      acc[u.type] = (acc[u.type] || 0) + 1;
      return acc;
    }, {});
    return {
      hotelsCount: hotelIds.length,
      totalOffersCached,
      updatesByType,
      nightsDistribution,
      foodDistribution,
      starsDistribution,
    };
  }, [session]);

  const foundHotel = useMemo(() => {
    const q = hotelIdInput.trim();
    if (!q) return null;
    return session.hotelsById[q] || null;
  }, [hotelIdInput, session.hotelsById]);

  if (collapsed) {
    return (
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setCollapsed(false)}
      >
        debug ▾
      </button>
    );
  }

  return (
    <div className={styles.panel}>
      <div className={styles.header}>
        <strong>v2 debug</strong>
        <button
          type="button"
          className={styles.toggle}
          onClick={() => setCollapsed(true)}
        >
          ▴
        </button>
      </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <span>sessionId</span>
          <code>{session.sessionId}</code>
        </div>
        <div className={styles.row}>
          <span>status</span>
          <code>{session.status}</code>
        </div>
        <div className={styles.row}>
          <span>snapshotVersion</span>
          <code>{session.snapshotVersion}</code>
        </div>
        <div className={styles.row}>
          <span>baselineEstablished</span>
          <code>{String(session.baselineEstablished)}</code>
        </div>
        <div className={styles.row}>
          <span>isLastResult</span>
          <code>{String(session.isLastResult)}</code>
        </div>
        <div className={styles.row}>
          <span>pageNumber</span>
          <code>{session.pageNumber}</code>
        </div>
        <div className={styles.row}>
          <span>hasMoreServerPages</span>
          <code>{String(session.hasMoreServerPages)}</code>
        </div>
        <div className={styles.row}>
          <span>unhelpfulContinuationCount</span>
          <code>{session.unhelpfulContinuationCount}</code>
        </div>
        <div className={styles.row}>
          <span>continuationMark</span>
          <code>{session.continuationMark ? JSON.stringify(session.continuationMark) : 'null'}</code>
        </div>
      </div>

      {session.progress && (
        <div className={styles.section}>
          <div className={styles.row}>
            <span>operators done</span>
            <code>{session.progress.operatorsDone}/{session.progress.operatorsTotal}</code>
          </div>
          <div className={styles.row}>
            <span>etaSeconds</span>
            <code>{session.progress.etaSeconds == null ? 'null' : session.progress.etaSeconds}</code>
          </div>
          <div className={styles.row}>
            <span>totalOffers</span>
            <code>{session.progress.totalOffers}</code>
          </div>
          <div className={styles.row}>
            <span>operatorsRunning</span>
            <code>{session.progress.operatorsRunning.join(', ') || '∅'}</code>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <div className={styles.row}>
          <span>hotels</span>
          <code>{stats.hotelsCount}</code>
        </div>
        <div className={styles.row}>
          <span>cached offers</span>
          <code>{stats.totalOffersCached}</code>
        </div>
        <div className={styles.row}>
          <span>updates</span>
          <code>
            total {session.updates.length} · unviewed {unviewedCount} ·{' '}
            new_hotel {stats.updatesByType.new_hotel || 0} ·{' '}
            price_drop {stats.updatesByType.price_drop || 0} ·{' '}
            slot_filled {stats.updatesByType.slot_filled || 0}
          </code>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.row}>
          <span>batches</span>
          <code>{session.batches.length}</code>
        </div>
        {session.batches.slice(-5).map((b) => (
          <div key={b.snapshotVersion} className={styles.subrow}>
            v{b.snapshotVersion}: {b.counts.hotels} hotels / {b.counts.offers} offers
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <input
          type="text"
          placeholder="hotel id"
          value={hotelIdInput}
          onChange={(e) => setHotelIdInput(e.target.value)}
          className={styles.input}
        />
        {foundHotel && (
          <pre className={styles.pre}>
            {JSON.stringify(
              {
                i: foundHotel.i,
                n: foundHotel.n,
                offers: Object.fromEntries(
                  Object.entries(foundHotel.offers).map(([k, v]) => [
                    k,
                    v ? { i: v.i, pl: v.pl } : null,
                  ]),
                ),
                history: Object.fromEntries(
                  Object.entries(foundHotel.history || {}).map(([k, v]) => [
                    k,
                    v.length,
                  ]),
                ),
                firstSeenSnapshot: foundHotel.firstSeenSnapshot,
                lastUpdatedSnapshot: foundHotel.lastUpdatedSnapshot,
                allOffers: (foundHotel.allOffers || []).length,
              },
              null,
              2,
            )}
          </pre>
        )}
      </div>
    </div>
  );
}
