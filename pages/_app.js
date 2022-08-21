import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import Head from 'next/head';
import Layout from '../components/common/layout';
import '../styles/globals.css';
import uk from '../lang/uk.json';
import ru from '../lang/ru.json';
import { getAllCountriesForNav } from 'utils/fetch';

const messages = {
  uk,
  ru,
};

function App({ Component, pageProps, navData }) {
  const { locale } = useRouter();

  return (
    <IntlProvider locale={locale} messages={messages[locale]}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, viewport-fit=cover"
        />
      </Head>
      <Layout navData={navData}>
        <Component {...pageProps} />
      </Layout>
    </IntlProvider>
  );
}

export default App;

App.getInitialProps = async ({ Component, ctx }) => {
  const loc = ctx.locale;
  const resData = await getAllCountriesForNav(loc);
  let navData;
  if (resData.errors || resData.data.length === 0) {
    /* eslint-disable-next-line */
    console.log(resData?.errors);
    navData = null;
  } else {
    navData = resData.data;
  }
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  return { pageProps, navData };
};
