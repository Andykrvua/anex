import { FormattedMessage as FM } from 'react-intl';
import {
  useSearchProgress,
  useSearchStatus,
  useSearchSession,
} from 'store/searchStore';
import styles from './SearchProgress.module.css';

export default function SearchProgress() {
  const progress = useSearchProgress();
  const status = useSearchStatus();
  const session = useSearchSession();

  if (!progress || progress.operatorsTotal === 0) return null;

  const totalHotels = Object.keys(session.hotelsById).length;
  const isSearching = status === 'searching';
  const ratio =
    progress.operatorsTotal > 0
      ? progress.operatorsDone / progress.operatorsTotal
      : 0;

  const showEta =
    isSearching && progress.etaSeconds != null && progress.etaSeconds > 1;
  const runningNames = progress.operatorsRunning;
  const showRunning = isSearching && runningNames.length > 0 && runningNames.length <= 2;

  return (
    <div className={styles.progress}>
      <div className={styles.header}>
        <strong className={styles.title}>
          {isSearching ? <FM id="progress.searching" /> : <FM id="progress.done" />}
        </strong>
        {isSearching && (
          <div className={styles.bar} aria-hidden>
            <div
              className={styles.barFill}
              style={{ width: `${Math.round(ratio * 100)}%` }}
            />
          </div>
        )}
      </div>
      <div className={styles.meta}>
        {isSearching && (
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
    </div>
  );
}
