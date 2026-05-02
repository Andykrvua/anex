import { FormattedMessage as FM } from 'react-intl';
import { useSortMode, useSetSortMode } from 'store/searchStore';
import styles from './SortToggle.module.css';

// 'stable' — первая опция и дефолт. Без неё юзер видит "Цена ↑" выбранной,
// а список сортируется в порядке появления — это вводило в заблуждение.
// Раньше для этого был чекбокс applyOnUpdates, но он лишь маскировал
// конфликт между UI-выбором и реальным порядком. Убрали.
const OPTIONS = [
  { value: 'stable', labelKey: 'sort.stable' },
  { value: 'price_asc', labelKey: 'sort.price_asc' },
  { value: 'price_desc', labelKey: 'sort.price_desc' },
  { value: 'rating_desc', labelKey: 'sort.rating_desc' },
];

export default function SortToggle() {
  const sortMode = useSortMode();
  const setSortMode = useSetSortMode();

  // Анимация смены сортировки — централизованно в HotelList (fade-in
  // при изменении orderKey). Здесь просто диспатчим setSortMode.
  return (
    <div className={styles.root}>
      <span className={styles.label}>
        <FM id="sort.title" />:
      </span>
      <div className={styles.options}>
        {OPTIONS.map((opt) => (
          <label
            key={opt.value}
            className={`${styles.option} ${
              sortMode === opt.value ? styles.optionActive : ''
            }`}
          >
            <input
              type="radio"
              name="v2-sort-mode"
              value={opt.value}
              checked={sortMode === opt.value}
              onChange={() => setSortMode(opt.value)}
            />
            <FM id={opt.labelKey} />
          </label>
        ))}
      </div>
    </div>
  );
}
