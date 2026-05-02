import { useEffect } from 'react';
import { FormattedMessage as FM } from 'react-intl';
import { useUnviewedUpdatesCount } from 'store/searchStore';
import PanelContent from './PanelContent';
import styles from './UpdatesDrawer.module.css';

/**
 * Универсальный drawer для панели "Обновления".
 *
 * Раньше desktop имел отдельный sticky-sidebar (UpdatesPanel) в layout-сетке,
 * который съедал 360px рядом с карточками и ломал верстку на 810-1100px.
 * Mobile имел свой drawer (UpdatesPanelMobile). Сейчас один паттерн:
 *   - FAB справа-снизу всегда (когда unviewedCount > 0 и drawer закрыт)
 *   - mobile (<810): sheet выезжает снизу
 *   - desktop (>=810): sheet выезжает справа, ширина 420px
 * CSS-разделение через media-query, JSX единый.
 *
 * `isMobile` приходит из родителя (getViewport), используется только для
 * добавления класса — самой логики drawer не меняет.
 */
export default function UpdatesDrawer({ open, onOpenToggle, onJump, isMobile }) {
  const count = useUnviewedUpdatesCount();

  // Body scroll lock при открытии — независим от viewport.
  useEffect(() => {
    if (!open) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const variantClass = isMobile ? styles.variantMobile : styles.variantDesktop;

  return (
    <>
      {count > 0 && !open && (
        <button
          type="button"
          className={styles.fab}
          onClick={() => onOpenToggle(true)}
        >
          <FM id="updates.title" />
          <span className={styles.fabCount}>{count}</span>
        </button>
      )}

      {open && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => onOpenToggle(false)}
            aria-hidden
          />
          <div
            className={`${styles.drawer} ${variantClass}`}
            role="dialog"
            aria-modal="true"
          >
            <header className={styles.drawerHeader}>
              <span className={styles.title}>
                <FM id="updates.title" />
                {count > 0 && (
                  <span className={styles.headerCount}>({count})</span>
                )}
              </span>
              <button
                type="button"
                className={styles.headerClose}
                onClick={() => onOpenToggle(false)}
                aria-label="close"
              >
                ×
              </button>
            </header>
            <div className={styles.drawerBody}>
              <PanelContent onJump={onJump} />
            </div>
          </div>
        </>
      )}
    </>
  );
}
