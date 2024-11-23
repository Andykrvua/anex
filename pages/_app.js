import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import Head from 'next/head';
import Layout from '../components/common/layout';
import '../styles/globals.css';
import uk from '../lang/uk.json';
import ru from '../lang/ru.json';
import { getAllCountriesForNav, getStaticData } from 'utils/fetch';
import { useEffect } from 'react';
import TagManager from 'react-gtm-module';

const messages = {
  uk,
  ru,
};

function App({ Component, pageProps, navData, staticData }) {
  const { locale, asPath } = useRouter();

  useEffect(() => {
    if (staticData?.tag_manager_id) {
      TagManager.initialize({ gtmId: staticData?.tag_manager_id });
    }
  }, []);

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
        <link rel="alternate" href={`${process.env.NEXT_PUBLIC_API_HOST}${asPath}`} hrefLang="ru-ua" />
        <link rel="alternate" href={`${process.env.NEXT_PUBLIC_API_HOST}${asPath}`} hrefLang="ru" />
        <link rel="alternate" href={`${process.env.NEXT_PUBLIC_API_HOST}/uk${asPath}`} hrefLang="uk-ua" />
        <link rel="alternate" href={`${process.env.NEXT_PUBLIC_API_HOST}/uk${asPath}`} hrefLang="uk" />
        <link rel="alternate" href={`${process.env.NEXT_PUBLIC_API_HOST}${asPath}`} hrefLang="x-default" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        {staticData?.google_site_ver && (
          <meta name="google-site-verification" content={staticData.google_site_ver} />
        )}
      </Head>
      <Layout navData={navData} staticData={staticData}>
        <Component {...pageProps} />
      </Layout>
    </IntlProvider>
  );
}

export default App;

App.getInitialProps = async ({ Component, ctx }) => {
  const loc = ctx.locale;

  // const [navResData, staticResData] = await Promise.all([getAllCountriesForNav(loc), getStaticData(loc)]);
  const navResData = await getAllCountriesForNav(loc);
  const staticResData = await getStaticData(loc);
  let navData;
  let staticData;

  if (navResData.errors || navResData?.data?.length === 0) {
    /* eslint-disable-next-line */
    console.log(navResData?.errors);
    navData = null;
  } else {
    navData = navResData.data;
  }

  if (staticResData.errors) {
    /* eslint-disable-next-line */
    console.log(staticResData.errors);
    staticData = null;
  } else {
    staticData = staticResData.data;
  }
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps, navData, staticData };
};
