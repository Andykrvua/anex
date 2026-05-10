import { useEffect } from 'react';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { useUnviewedUpdatesCount } from 'store/searchStore';
import CloseSvg from 'components/common/closeSvg';
import PanelContent from './PanelContent';
import styles from './UpdatesDrawer.module.css';

/**
 * Universal drawer for the "Updates" panel.
 *
 * Previously desktop had a separate sticky-sidebar (UpdatesPanel) in the layout
 * grid, consuming 360px next to cards and breaking layout at 810-1100px.
 * Mobile had its own drawer (UpdatesPanelMobile). Now there is one pattern:
 *   - FAB bottom-right always visible (when unviewedCount > 0 and drawer is closed)
 *   - mobile (<810): sheet slides up from the bottom
 *   - desktop (>=810): sheet slides in from the right, width 420px
 * CSS split via media-query, JSX is unified.
 *
 * `isMobile` comes from the parent (getViewport), used only to add a class —
 * does not change the drawer logic itself.
 */
export default function UpdatesDrawer({ open, onOpenToggle, onJump }) {
  const intl = useIntl();
  const count = useUnviewedUpdatesCount();

  // Body scroll lock on open — viewport-independent.
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
              {/* Mobile: arrow + line (like the burger, but mirrored — closing
                  pulls the panel right). Desktop: X stroke (CloseSvg). Matches
                  the .burger_close / .burger_close_not_mobile split. */}
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
