import { useIntl, FormattedMessage as FM } from 'react-intl';
import useUrlFilters from 'hooks/useUrlFilters';
import {
  useUnviewedUpdatesCount,
  useFreezeUpdatedOnly,
  useUnfreezeUpdatedOnly,
} from 'store/searchStore';
import Checkbox from 'components/controls/checkbox/checkbox';
import styles from './QualityFilters.module.css';

/**
 * Per-list quality filters (applied on top of already found results):
 *   - fullOnly: only hotels with ALL slots `[n, n+1, n+2]` filled.
 *   - updatedOnly: only hotels with unviewed updates.
 *
 * State in URL (`?fullOnly=1`, `?updatedOnly=1`) — so a page reload preserves
 * the selection. Filtering logic lives in `selectOrderedHotelIds`.
 *
 * updatedOnly requires freeze/unfreeze: on toggle ON we snapshot the set of
 * hotel ids, otherwise observer markViewed would drop cards one by one while
 * scrolling. Checkbox is disabled while there are no unviewed updates in the
 * results — to prevent the user from getting an empty list instead of feedback.
 */
export default function QualityFilters() {
  const intl = useIntl();
  const { fullOnly, updatedOnly, setFilter } = useUrlFilters();
  const unviewedCount = useUnviewedUpdatesCount();
  const freezeUpdatedOnly = useFreezeUpdatedOnly();
  const unfreezeUpdatedOnly = useUnfreezeUpdatedOnly();

  const updatedOnlyDisabled = !updatedOnly && unviewedCount === 0;

  const handleUpdatedOnlyChange = (checked) => {
    if (checked) freezeUpdatedOnly();
    else unfreezeUpdatedOnly();
    setFilter('updatedOnly', checked);
  };

  return (
    <div className={styles.root}>
      <Checkbox
        label={<FM id="filter.full_only" />}
        check={fullOnly}
        setCheck={(v) => setFilter('fullOnly', v)}
      />
      <Checkbox
        label={<FM id="filter.updated_only" />}
        check={updatedOnly}
        setCheck={handleUpdatedOnlyChange}
        disabled={updatedOnlyDisabled}
        title={
          updatedOnlyDisabled
            ? intl.formatMessage({ id: 'filter.updated_only_empty_hint' })
            : undefined
        }
      />
    </div>
  );
}
