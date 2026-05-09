import { useEffect, useRef, useState } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import {
  useSearchProgress,
  useSearchStatus,
  useSearchSession,
} from 'store/searchStore';
import styles from './SearchProgress.module.css';

const MIN_SEARCHING_MS = 1000;

export default function SearchProgress() {
  const progress = useSearchProgress();
  const status = useSearchStatus();
  const session = useSearchSession();

  const isSearching = status === 'searching';
  // Cached responses can flip status searching → done within <100ms, so the
  // user barely sees any progress animation. Keep "searching" UI on screen
  // for at least MIN_SEARCHING_MS to make the indicator perceptible.
  const [displaySearching, setDisplaySearching] = useState(isSearching);
  const startedAtRef = useRef(0);

  useEffect(() => {
    if (isSearching) {
      startedAtRef.current = Date.now();
      setDisplaySearching(true);
      return undefined;
    }
    const elapsed = Date.now() - (startedAtRef.current || 0);
    const remaining = Math.max(0, MIN_SEARCHING_MS - elapsed);
    if (remaining === 0) {
      setDisplaySearching(false);
      return undefined;
    }
    const t = setTimeout(() => setDisplaySearching(false), remaining);
    return () => clearTimeout(t);
  }, [isSearching]);

  const hasMeta = !!(progress && progress.operatorsTotal > 0);

  // Render the searching indicator even before the first response arrives
  // (cached result + lastResult=true would otherwise flip "Поиск завершён"
  // before the user noticed any progress at all).
  if (!hasMeta && !displaySearching) return null;

  const totalHotels = Object.keys(session.hotelsById).length;

  const runningNames = (progress && progress.operatorsRunning) || [];
  const showEta =
    displaySearching && hasMeta && progress.etaSeconds != null && progress.etaSeconds > 1;
  const showRunning =
    displaySearching && runningNames.length > 0 && runningNames.length <= 2;

  return (
    <div className={styles.progress}>
      <div className={styles.header}>
        <strong className={styles.title}>
          {displaySearching ? <FM id="progress.searching" /> : <FM id="progress.done" />}
        </strong>
        {displaySearching && (
          <div className={styles.bar} aria-hidden>
            <div className={styles.barFill} />
          </div>
        )}
      </div>
      {hasMeta && (
        <div className={styles.meta}>
          {displaySearching && (
            <>
              <span>
                <FM
                  id="progress.operators_done"
                  values={{
                    done: progress.operatorsDone,
                    total: progress.operatorsTotal,
                  }}
                />
              </span>
              {showEta && (
                <span>
                  {' · '}
                  <FM
                    id="progress.eta_seconds"
                    values={{ sec: progress.etaSeconds }}
                  />
                </span>
              )}
              {' · '}
            </>
          )}
          <span>
            <FM
              id="progress.found_summary"
              values={{ offers: progress.totalOffers, hotels: totalHotels }}
            />
          </span>
          {showRunning && (
            <span title={runningNames.join(', ')}>
              {' · '}
              <FM
                id="progress.still_running"
                values={{ names: runningNames.join(', ') }}
              />
            </span>
          )}
        </div>
      )}
    </div>
  );
}
