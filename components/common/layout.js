import Header from './header/header';
import Footer from './footer/footer';
import Modal from './modal';
import Burger from './burger/burger';
import InfoModal from './infoModal';
import ScrollTop from 'components/controls/scrollTop';
import MessBtn from 'components/controls/messBtn';
import { useIntl } from 'react-intl';
import Head from 'next/head';

export default function Layout({ children, navData }) {
  const intl = useIntl();
  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'default.title' })}</title>
        <meta name="description" content={intl.formatMessage({ id: 'default.description' })} />
      </Head>
      <div className="wrapper">
        <InfoModal />
        <Header navData={navData} />
        <main className="content">{children}</main>
        <Footer />
        <Burger />
        <Modal />
        <ScrollTop />
        <MessBtn />
      </div>
    </>
  );
}
