import styles from './loadingPlaceholder.module.css';
import { FormattedMessage as FM } from 'react-intl';

export default function loadingPlaceholder() {
  return (
    <div className={styles.main_form_loading}>
      <FM id="common.loading" />
    </div>
  );
}
