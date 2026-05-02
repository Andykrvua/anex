import { FormattedMessage as FM } from 'react-intl';
import styles from './v2cards.module.css';

const TYPE_TO_LABEL = {
  new_hotel: 'card.badge.new_hotel',
  price_drop: 'card.badge.price_drop',
  slot_filled: 'card.badge.slot_filled',
  mixed: 'card.badge.updated',
};

const TYPE_TO_VARIANT = {
  new_hotel: styles.cardBadge_newHotel,
  price_drop: styles.cardBadge_priceDrop,
  slot_filled: styles.cardBadge_slotFilled,
  mixed: styles.cardBadge_mixed,
};

/**
 * Бейдж сверху карточки — суммарный индикатор unviewed updates.
 *
 * Если все updates одного типа → специфичный label/цвет.
 * Если смешанные → "Обновлено".
 */
export default function CardBadge({ updates }) {
  if (!updates || !updates.length) return null;

  const types = new Set(updates.map((u) => u.type));
  const dominant = types.size === 1 ? updates[0].type : 'mixed';
  const labelKey = TYPE_TO_LABEL[dominant];
  const variantClass = TYPE_TO_VARIANT[dominant];

  return (
    <div className={`${styles.cardBadge} ${variantClass}`}>
      <FM id={labelKey} />
    </div>
  );
}
