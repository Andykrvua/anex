import { useLayoutEffect, useRef } from 'react';
import HotelCard from './HotelCard';
import styles from './HotelCard.module.css';

const FADE_IN_MS = 220;

/**
 * Fade-in списка при смене порядка id-шников. FLIP убрали потому что он
 * не работает при cross-page reorder (картки уезжают на другую страницу
 * пагинации, их id-шников нет ни в prevRects, ни в newRects, FLIP их
 * пропускает — анимация выглядит как телепорт).
 *
 * Стратегия:
 *   - useLayoutEffect runs после commit, новый DOM уже есть.
 *   - Сравниваем prevOrderKey с newOrderKey.
 *   - Если изменился И это не append-only (polling добавляет hotels в хвост) —
 *     запускаем fade-in: opacity 0 → 1 with transition.
 *   - Append-only пропускаем, иначе список бы blink-ал каждые 5s polling.
 *
 * Покрывает: sortMode toggle, quality-filter toggle, pagination, freeze
 * updatedOnly, любой ingest, который реально пересортирует существующие
 * card-ы. НЕ блимает на чистое расширение списка снизу.
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

    // Append-only: новый orderKey = старый + "|new1|new2…". Polling добавляет
    // отели в хвост — это не reorder, без fade.
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
