import { useEffect, useRef } from 'react';

const VISIBILITY_THRESHOLD = 0.4;
const DWELL_MS = 1500;

/**
 * Marks updates as viewed when the element is continuously visible for ≥1.5 s.
 *
 *   - threshold 0.4 — card is considered visible when 40% is in the viewport.
 *   - DWELL_MS 1500 — the user must actually dwell on it.
 *   - If the card scrolls past faster → timer is reset,
 *     updates remain unviewed.
 *
 * @param {React.RefObject<HTMLElement>} ref
 * @param {string[]} updateIds  unviewed update ids for this card
 * @param {(ids: string[]) => void} onSeen  typically — markUpdatesViewed
 */
export default function useViewedObserver(ref, updateIds, onSeen) {
  const timerRef = useRef(null);
  // Ref to the current ids to avoid recreating the observer on every
  // array change (often recreated even with ref-equality).
  const idsRef = useRef(updateIds);
  idsRef.current = updateIds;

  useEffect(() => {
    if (typeof window === 'undefined' || typeof IntersectionObserver === 'undefined') {
      return undefined;
    }
    const el = ref.current;
    if (!el) return undefined;
    if (!updateIds || updateIds.length === 0) return undefined;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= VISIBILITY_THRESHOLD) {
            if (!timerRef.current) {
              timerRef.current = setTimeout(() => {
                timerRef.current = null;
                const current = idsRef.current;
                if (current && current.length) onSeen(current);
              }, DWELL_MS);
            }
          } else if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
          }
        }
      },
      { threshold: [0, VISIBILITY_THRESHOLD, 0.8] },
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // updateIds.join — stable key to avoid recreating the observer on
    // reference-instance differences while still reacting to real changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, updateIds.join(','), onSeen]);
}
