import Head from 'next/head';
import { useIntl } from 'react-intl';

export default function SeoHead({ content }) {
  const intl = useIntl();
  return (
    <Head>
      <title>
        {content.translations
          ? content.translations[0].title
          : intl.formatMessage({ id: 'default.title' })}
      </title>
      <meta
        name="description"
        content={
          content.translations
            ? content.translations[0].description
            : intl.formatMessage({ id: 'default.description' })
        }
      />
    </Head>
  );
}
