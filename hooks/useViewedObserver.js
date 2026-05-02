import { useEffect, useRef } from 'react';

const VISIBILITY_THRESHOLD = 0.4;
const DWELL_MS = 1500;

/**
 * Помечает updates просмотренными, когда элемент непрерывно виден ≥1.5 с.
 *
 *   - threshold 0.4 — карточка считается видимой, если 40% в viewport.
 *   - DWELL_MS 1500 — пользователь должен реально на ней задержаться.
 *   - Если карточка прокручивается мимо быстрее → таймер сбрасывается,
 *     updates остаются непросмотренными.
 *
 * @param {React.RefObject<HTMLElement>} ref
 * @param {string[]} updateIds  unviewed update ids этой карточки
 * @param {(ids: string[]) => void} onSeen  обычно — markUpdatesViewed
 */
export default function useViewedObserver(ref, updateIds, onSeen) {
  const timerRef = useRef(null);
  // Ссылка на актуальные ids, чтобы не пересоздавать observer при каждом
  // изменении массива (часто пересоздаётся даже при ref-equality).
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
    // updateIds.join — стабильный ключ, чтобы не пересоздавать observer
    // при reference-инстанс-разнице, но реагировать на реальные изменения.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, updateIds.join(','), onSeen]);
}
