import { FormattedMessage as FM } from 'react-intl';
import { useSortMode, useSetSortMode } from 'store/searchStore';
import styles from './SortToggle.module.css';

// 'stable' — first option and default. Without it the user sees "Price ↑" selected
// while the list is sorted by arrival order — this was misleading.
// Previously there was a checkbox applyOnUpdates, but it only masked
// the conflict between the UI choice and actual order. Removed.
const OPTIONS = [
  { value: 'stable', labelKey: 'sort.stable' },
  { value: 'price_asc', labelKey: 'sort.price_asc' },
  { value: 'price_desc', labelKey: 'sort.price_desc' },
  { value: 'rating_desc', labelKey: 'sort.rating_desc' },
];

export default function SortToggle() {
  const sortMode = useSortMode();
  const setSortMode = useSetSortMode();

  // Sort change animation — centralized in HotelList (fade-in
  // on orderKey change). Here we simply dispatch setSortMode.
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
