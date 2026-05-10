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
  // (cached result + lastResult=true would otherwise flip to "Search complete"
  // before the user noticed any progress at all).
  if (!hasMeta && !displaySearching) return null;

  // session.batches accumulates every snapshot of the CURRENT cycle
  // (resetSession clears the array on startNewSearch).
  //   counts.slotOffers — actual number of offers visible to the user (≤3 per
  //     hotel), used for all texts in meta.
  //   counts.offers — operator×nights total, not shown (inflated).
  // We use slotOffers for:
  //   1. cycleStarted — meta-block gate (don't show "0 offers in 802 hotels"
  //      until the first meaningful batch of the new session arrives).
  //   2. lastDeltaSlotOffers — "+N in last update" only from the 2nd batch
  //      (for the first one the delta and the absolute are the same).
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
        Always render .meta (with min-height in CSS) so that in the start phase
        (cycleStarted=false) the controlsBar height stays stable — otherwise
        the pin/collapse buttons on the right (40×40) would poke through the
        wrapper. Text is rendered only when there are batches for the current
        cycle — without this after clicking "new search" you briefly see
        "0 offers in 802 hotels" before a proper batch arrives.
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
