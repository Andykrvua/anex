import { useIntl, FormattedMessage as FM } from 'react-intl';
import styles from './content.module.css';

export default function PrivacyPolicyContent({ pageSettings }) {
  const intl = useIntl();

  return (
    <div className={styles.privacy_policy}>
      <h1 className="block_title">
        <FM id="nav.privacy_policy" />
      </h1>
      <div
        className={styles.content}
        dangerouslySetInnerHTML={{
          __html: pageSettings?.translations[0]?.content,
        }}
      />
    </div>
  );
}
