import { useEffect } from 'react';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { useUnviewedUpdatesCount } from 'store/searchStore';
import CloseSvg from 'components/common/closeSvg';
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
export default function UpdatesDrawer({ open, onOpenToggle, onJump }) {
  const intl = useIntl();
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

  const closeLabel = intl.formatMessage({ id: 'updates.close' });

  return (
    <>
      {count > 0 && !open && (
        <button
          type="button"
          className={styles.fab}
          onClick={() => onOpenToggle(true)}
        >
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
            className={styles.drawer}
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
              {/* Mobile: arrow + line (как в burger, но зеркально — закрытие
                  тащит panel вправо). Desktop: X stroke (CloseSvg). Совпадает
                  с разделением .burger_close / .burger_close_not_mobile. */}
              <button
                type="button"
                className={`svg_btn ${styles.headerClose} ${styles.headerCloseMobile}`}
                onClick={() => onOpenToggle(false)}
                aria-label={closeLabel}
              >
                <svg
                  width="42"
                  height="42"
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ transform: 'scaleX(-1)' }}
                >
                  <path d="M30 22a1 1 0 1 0 0-2v2Zm-18.707-1.707a1 1 0 0 0 0 1.414l6.364 6.364a1 1 0 0 0 1.414-1.414L13.414 21l5.657-5.657a1 1 0 0 0-1.414-1.414l-6.364 6.364ZM30 20H12v2h18v-2Z" />
                </svg>
              </button>
              <button
                type="button"
                className={`svg_btn svg_btn_stroke ${styles.headerClose} ${styles.headerCloseDesktop}`}
                onClick={() => onOpenToggle(false)}
                aria-label={closeLabel}
              >
                <CloseSvg />
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
