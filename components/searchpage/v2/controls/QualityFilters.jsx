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
 * Per-list quality filters (поверх уже найденных результатов):
 *   - fullOnly: только отели, у которых заполнены ВСЕ слоты `[n, n+1, n+2]`.
 *   - updatedOnly: только отели с unviewed updates.
 *
 * Состояние в URL (`?fullOnly=1`, `?updatedOnly=1`) — чтобы перезагрузка
 * страницы сохраняла выбор. Логика фильтрации — в `selectOrderedHotelIds`.
 *
 * updatedOnly требует freeze/unfreeze: на toggle ON фиксируем snapshot
 * id-шников, иначе observer markViewed выпиливал карточки одну за другой
 * прямо во время скрола. Чекбокс disabled, пока в выдаче нет unviewed
 * updates — чтобы юзер не получал пустой список вместо feedback.
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
