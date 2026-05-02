import { useState } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import {
  useSearchSession,
  useGroupedUpdates,
  useUnviewedUpdatesCount,
  useMarkAllViewed,
  useSortMode,
  useFrozenUpdatedOnlyIds,
} from 'store/searchStore';
import { selectHotelPageIndex } from 'utils/searchMerge';
import useUrlFilters from 'hooks/useUrlFilters';
import UpdateRow from './UpdateRow';
import styles from './UpdatesPanel.module.css';

const PAGE_SIZE = 20;

const SECTIONS = [
  { key: 'new_hotel', titleKey: 'updates.section.new_hotels' },
  { key: 'price_drop', titleKey: 'updates.section.price_drops' },
  { key: 'slot_filled', titleKey: 'updates.section.slots_filled' },
];

/**
 * Внутреннее тело панели обновлений (общее для desktop sidebar и
 * mobile bottom-sheet). Снаружи передаётся `onJump(hotelId, pageIndex)`.
 */
export default function PanelContent({ onJump, onClose }) {
  const session = useSearchSession();
  const grouped = useGroupedUpdates();
  const unviewedCount = useUnviewedUpdatesCount();
  const markAllViewed = useMarkAllViewed();
  const sortMode = useSortMode();
  const frozenUpdatedOnlyIds = useFrozenUpdatedOnlyIds();
  const { fullOnly, updatedOnly } = useUrlFilters();
  const filters = { fullOnly, updatedOnly };

  // Локальное "свернуть всё" — управляется кнопкой и кликом по заголовку.
  const [collapsed, setCollapsed] = useState({});
  const allCollapsed = SECTIONS.every((s) => collapsed[s.key]);
  const toggleCollapsed = (key) =>
    setCollapsed((prev) => ({ ...prev, [key]: !prev[key] }));
  const collapseAll = () =>
    setCollapsed({ new_hotel: !allCollapsed, price_drop: !allCollapsed, slot_filled: !allCollapsed });

  if (unviewedCount === 0) {
    return (
      <div className={styles.empty}>
        <FM id="updates.empty" />
      </div>
    );
  }

  return (
    <div className={styles.panelContent}>
      <div className={styles.actions}>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={() => markAllViewed()}
        >
          <FM id="updates.action.mark_all_viewed" />
        </button>
        <button
          type="button"
          className={styles.actionBtn}
          onClick={collapseAll}
        >
          <FM id="updates.action.collapse_all" />
        </button>
      </div>

      {SECTIONS.map((section) => {
        const items = grouped[section.key] || [];
        if (!items.length) return null;
        const isCollapsed = !!collapsed[section.key];
        return (
          <section key={section.key} className={styles.section}>
            <button
              type="button"
              className={styles.sectionHeader}
              onClick={() => toggleCollapsed(section.key)}
            >
              <span className={styles.caret}>{isCollapsed ? '▶' : '▼'}</span>
              <FM id={section.titleKey} />
              <span className={styles.sectionCount}>({items.length})</span>
            </button>
            {!isCollapsed && (
              <div className={styles.sectionBody}>
                {items.map((u) => {
                  const hotel = session.hotelsById[u.hotelId];
                  const pageIndex = selectHotelPageIndex(
                    session,
                    u.hotelId,
                    PAGE_SIZE,
                    filters,
                    sortMode,
                    frozenUpdatedOnlyIds,
                  );
                  return (
                    <UpdateRow
                      key={u.id}
                      update={u}
                      hotel={hotel}
                      pageIndex={pageIndex}
                      onJump={onJump}
                    />
                  );
                })}
              </div>
            )}
          </section>
        );
      })}

      {onClose && (
        <button
          type="button"
          className={styles.closeBtnInline}
          onClick={onClose}
        >
          ×
        </button>
      )}
    </div>
  );
}
