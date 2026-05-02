import { useState } from 'react';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { useRouter } from 'next/router';
import declension from 'utils/declension';
import PriceHistoryPopover from './PriceHistoryPopover';
import styles from './HotelCard.module.css';
import v2styles from './v2cards.module.css';

const formatDayMonth = (iso) =>
  new Date(iso).toLocaleDateString('default', {
    day: '2-digit',
    month: '2-digit',
  });

const formatPrice = (uah) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(uah);

/**
 * Один nights-слот карточки. Phase 3 — три состояния:
 *   1. searching && !offer       → "Ещё ищем…" (placeholder, пока polling)
 *   2. !searching && !offer      → "Не найдено" (lastResult пришёл, оффера нет)
 *   3. offer есть                 → дата, ночи, комната, цена, ссылка
 *
 * Phase 4 добавит price_drop / slot_filled индикаторы.
 */
export default function OfferSlot({
  hotel,
  nights,
  offer,
  isSearching,
  searchParams,
  slotUpdate,
  history,
}) {
  const router = useRouter();
  const intl = useIntl();
  const tTxt1 = intl.formatMessage({ id: 'common.night1' });
  const tTxt2 = intl.formatMessage({ id: 'common.night2' });
  const tTxt5 = intl.formatMessage({ id: 'common.night5' });
  const decl = (val) => declension(val, tTxt1, tTxt2, tTxt5);

  const [historyOpen, setHistoryOpen] = useState(false);
  const hasHistory = !!history && history.length > 0;
  // Current offer был поставлен в момент последней замены (max snapshotVersion
  // в history). Если history пустая — точного значения нет, и иконку не показываем.
  const currentSnapshot = hasHistory
    ? Math.max(...history.map((h) => h.snapshotVersion))
    : null;
  const handleInfoClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHistoryOpen((v) => !v);
  };

  if (!offer) {
    return (
      <div className={`${styles.card_order} ${styles.card_order_empty}`}>
        <span className={styles.order_text_wrapper}>
          <span className={styles.order_text__duration}>
            <span>
              {nights} {decl(nights)}
            </span>
          </span>
        </span>
        <span className={styles.order_not_found}>
          {isSearching ? (
            <FM id="slot.searching" />
          ) : (
            <FM id="slot.empty" />
          )}
        </span>
      </div>
    );
  }

  const localePrefix = router.locale === 'uk' ? '/uk' : '';
  const href =
    `${localePrefix}/hotels/${hotel.t.c}/${hotel.t.i}-${hotel.i}-${hotel.h}` +
    `?offer=${offer.i}` +
    `&transport=${searchParams.transport}` +
    `&from=${searchParams.from}` +
    `&fromname=${searchParams.fromname}` +
    `&to=${searchParams.to}` +
    `&checkIn=${searchParams.checkIn}` +
    `&checkTo=${searchParams.checkTo}` +
    `&nights=${searchParams.nights}` +
    `&nightsTo=${searchParams.nightsTo}` +
    `&people=${searchParams.people}`;

  const transitDays = offer.n - offer.nh;

  const isPriceDrop = slotUpdate && slotUpdate.type === 'price_drop';
  const isSlotFilled = slotUpdate && slotUpdate.type === 'slot_filled';
  const dropPct =
    isPriceDrop && slotUpdate.before && slotUpdate.before.pl
      ? Math.max(
          1,
          Math.round(
            ((slotUpdate.before.pl - slotUpdate.after.pl) / slotUpdate.before.pl) *
              100,
          ),
        )
      : null;

  return (
    <a
      className={styles.card_order}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {isPriceDrop && (
        <span
          className={`${v2styles.slotIndicator} ${v2styles.slotIndicator_priceDrop}`}
        >
          <FM id="slot.price_drop_pct" values={{ pct: dropPct }} />
          {' · '}
          <span className={v2styles.slotIndicator_oldPrice}>
            {formatPrice(slotUpdate.before.pl)}
          </span>
        </span>
      )}
      {isSlotFilled && (
        <span
          className={`${v2styles.slotIndicator} ${v2styles.slotIndicator_slotFilled}`}
        >
          <FM id="slot.slot_filled_label" />
        </span>
      )}
      <span className={styles.order_text_wrapper}>
        <span className={styles.order_text__duration}>
          <span>
            {formatDayMonth(offer.d)} <FM id="hotel_card.tourstart" />
          </span>
        </span>
        <span className={styles.order_text__people}>
          <span>
            {formatDayMonth(offer.dt)} <FM id="hotel_card.tourend" />
          </span>
        </span>
      </span>
      <span
        className={`${styles.order_text_wrapper}, ${styles.order_text_wrapper__fluid}`}
      >
        <span className={styles.order_text__duration}>
          <span>
            {offer.nh} {decl(offer.nh)}
            {transitDays !== 0
              ? ` + ${transitDays} ${intl.formatMessage({ id: 'hotel_card.tour_time' })}`
              : ''}
          </span>
        </span>
        <span className={styles.order_text__people}>
          <span>{offer.r}</span>
        </span>
      </span>
      <span className={styles.order_price}>
        {formatPrice(offer.pl)}
        {hasHistory && (
          <span className={v2styles.historyAnchor}>
            <button
              type="button"
              className={v2styles.historyTrigger}
              onClick={handleInfoClick}
              aria-label="price history"
            >
              i
            </button>
            <PriceHistoryPopover
              open={historyOpen}
              onClose={() => setHistoryOpen(false)}
              nights={nights}
              currentOffer={offer}
              currentSnapshot={currentSnapshot}
              history={history}
            />
          </span>
        )}
        <img src="/assets/img/svg/arrow.svg" alt="" />
      </span>
    </a>
  );
}
