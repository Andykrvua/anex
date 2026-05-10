import { useIntl, FormattedMessage as FM } from 'react-intl';
import useUrlFilters from 'hooks/useUrlFilters';
import {
  useUnviewedUpdatesCount,
  useUpdatedOnly,
  useSetUpdatedOnly,
} from 'store/searchStore';
import Checkbox from 'components/controls/checkbox/checkbox';
import styles from './QualityFilters.module.css';

/**
 * Per-list quality filters (applied on top of already found results):
 *   - fullOnly: only hotels with ALL slots `[n, n+1, n+2]` filled.
 *     URL-persisted (`?fullOnly=1`) — applies to first results too.
 *   - updatedOnly: only hotels with unviewed updates. Store-only (NOT URL):
 *     updates appear after polling, so persisting across reloads is useless.
 *     setUpdatedOnly handles toggle + frozen-snapshot atomically (otherwise
 *     observer markViewed would drop cards one by one while scrolling).
 *     Disabled while there are no unviewed updates — to prevent an empty list.
 *
 * Filtering logic lives in `selectOrderedHotelIds`.
 */
export default function QualityFilters() {
  const intl = useIntl();
  const { fullOnly, setFilter } = useUrlFilters();
  const updatedOnly = useUpdatedOnly();
  const setUpdatedOnly = useSetUpdatedOnly();
  const unviewedCount = useUnviewedUpdatesCount();

  const updatedOnlyDisabled = !updatedOnly && unviewedCount === 0;

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
        setCheck={setUpdatedOnly}
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
