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

  // session.batches накапливается каждый snapshot ТЕКУЩЕГО цикла
  // (resetSession очищает массив на startNewSearch).
  //   counts.slotOffers — реальное число оферов, видимых юзеру (≤3 на
  //     отель), используем для всех текстов в meta.
  //   counts.offers — operator×nights total, не показываем (раздут).
  // Используем slotOffers для:
  //   1. cycleStarted — гейт meta-блока (не показываем «0 оферов в 802»
  //      пока не пришёл первый осмысленный батч новой сессии).
  //   2. lastDeltaSlotOffers — «+N в последнем обновлении» только со 2-го
  //      батча (для первого разница и абсолют совпадают).
  const batches = session.batches || [];
  const cycleStarted = batches.length > 0;
  const lastBatch = cycleStarted ? batches[batches.length - 1] : null;
  const prevBatch = batches.length >= 2 ? batches[batches.length - 2] : null;
  const lastDeltaSlotOffers =
    lastBatch && prevBatch
      ? (lastBatch.counts.slotOffers || 0) - (prevBatch.counts.slotOffers || 0)
      : 0;
  const showLastDelta = displaySearching && lastDeltaSlotOffers > 0;

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
      {/*
        Завжди рендеримо .meta (з min-height в CSS), щоб у стартовій фазі
        (cycleStarted=false) висота controlsBar лишалась стабільною — інакше
        кнопки pin/collapse справа (40×40) пробивали б обвертку. Текст
        вкладаємо тільки коли є батчі поточного циклу — без цього після
        кліку "новий пошук" коротко видно "0 оферов в 802 отелях" поки не
        прийшов нормальний батч.
      */}
      <div className={styles.meta}>
        {cycleStarted && (
          <>
            <span>
              {displaySearching ? (
                <FM
                  id="progress.cycle_received"
                  values={{
                    hotels: lastBatch.counts.hotels,
                    offers: lastBatch.counts.slotOffers || 0,
                  }}
                />
              ) : (
                <FM
                  id="progress.found_summary"
                  values={{
                    offers: lastBatch.counts.slotOffers || 0,
                    hotels: lastBatch.counts.hotels,
                  }}
                />
              )}
            </span>
            {showLastDelta && (
              <span>
                {' · '}
                <FM id="progress.last_delta" values={{ delta: lastDeltaSlotOffers }} />
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
