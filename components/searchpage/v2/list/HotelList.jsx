import { useLayoutEffect, useRef } from 'react';
import HotelCard from './HotelCard';
import styles from './HotelCard.module.css';

const FADE_IN_MS = 220;

/**
 * Fade-in of the list when the order of hotel ids changes. FLIP was removed
 * because it does not work with cross-page reorder (cards move to another
 * pagination page, their ids are in neither prevRects nor newRects, FLIP
 * skips them — animation looks like a teleport).
 *
 * Strategy:
 *   - useLayoutEffect runs after commit, new DOM is already present.
 *   - Compare prevOrderKey with newOrderKey.
 *   - If changed AND it is not append-only (polling adds hotels to the tail) —
 *     trigger fade-in: opacity 0 → 1 with transition.
 *   - Skip append-only, otherwise the list would blink every 5s of polling.
 *
 * Covers: sortMode toggle, quality-filter toggle, pagination, freeze
 * updatedOnly, any ingest that genuinely re-sorts existing cards.
 * Does NOT blink on a pure list extension from below.
 */
export default function HotelList({
  hotels,
  searchParams,
  countryHotelService,
  slots,
  highlightedId,
}) {
  const wrapRef = useRef(null);
  const prevOrderRef = useRef('');

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || typeof window === 'undefined') return;

    const orderKey = hotels.map((h) => h.i).join('|');
    const prevOrder = prevOrderRef.current;
    prevOrderRef.current = orderKey;

    if (prevOrder === '' || prevOrder === orderKey) return;

    // Append-only: new orderKey = old + "|new1|new2…". Polling adds
    // hotels to the tail — this is not a reorder, skip fade.
    const isAppendOnly =
      orderKey.startsWith(`${prevOrder}|`) && orderKey.length > prevOrder.length;
    if (isAppendOnly) return;

    wrap.style.transition = 'none';
    wrap.style.opacity = '0';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrap.style.transition = `opacity ${FADE_IN_MS}ms ease-out`;
        wrap.style.opacity = '1';
        setTimeout(() => {
          wrap.style.transition = '';
          wrap.style.opacity = '';
        }, FADE_IN_MS + 20);
      });
    });
  });

  return (
    <div ref={wrapRef} className={styles.cards_wrapper}>
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel.i}
          hotel={hotel}
          searchParams={searchParams}
          countryHotelService={countryHotelService}
          slots={slots}
          isHighlighted={String(hotel.i) === highlightedId}
        />
      ))}
    </div>
  );
}
