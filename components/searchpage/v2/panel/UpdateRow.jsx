import { FormattedMessage as FM } from 'react-intl';
import styles from './UpdatesPanel.module.css';

const formatPrice = (uah) =>
  new Intl.NumberFormat('uk-UA', {
    style: 'currency',
    currency: 'UAH',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(uah);

/**
 * Один update в панели обновлений: миниатюра + название + контекст + кнопка.
 *
 * Контекст зависит от типа:
 *  - new_hotel   → страна / курорт.
 *  - price_drop  → "{nights} ноч.: {old} → {new}".
 *  - slot_filled → "Найден офер на {nights} ноч.: {price}".
 */
export default function UpdateRow({ update, hotel, pageIndex, onJump }) {
  if (!hotel) return null;

  let context = null;
  if (update.type === 'new_hotel') {
    const country = hotel.t && hotel.t.n;
    const resort = hotel.c && hotel.c.n;
    context = [country, resort].filter(Boolean).join(' · ');
  } else if (update.type === 'price_drop' && update.before && update.after) {
    context = (
      <FM
        id="updates.row.price_change"
        values={{
          nights: update.nights,
          oldPrice: formatPrice(update.before.pl),
          newPrice: formatPrice(update.after.pl),
        }}
      />
    );
  } else if (update.type === 'slot_filled' && update.after) {
    context = (
      <FM
        id="updates.row.slot_filled"
        values={{
          nights: update.nights,
          price: formatPrice(update.after.pl),
        }}
      />
    );
  }

  return (
    <div className={styles.row}>
      {hotel.f && (
        <img
          className={styles.thumb}
          src={`https://newimg.otpusk.com/2/80x80/${hotel.f}`}
          alt=""
          loading="lazy"
          width="48"
          height="48"
        />
      )}
      <div className={styles.rowText}>
        <div className={styles.rowTitle} title={hotel.n}>
          {hotel.n}
        </div>
        {context && <div className={styles.rowContext}>{context}</div>}
        {pageIndex && (
          <div className={styles.rowPage}>
            <FM id="updates.row.page" values={{ n: pageIndex }} />
          </div>
        )}
      </div>
      <button
        type="button"
        className={styles.rowJump}
        onClick={() => onJump(hotel.i, pageIndex)}
      >
        <FM id="updates.row.go_to" />
      </button>
    </div>
  );
}
