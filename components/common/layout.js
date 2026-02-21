import Header from './header/header';
import Footer from './footer/footer';
import Modal from './modal';
import Burger from './burger/burger';
import InfoModal from './infoModal';
import ScrollTop from 'components/controls/scrollTop';
import MessBtn from 'components/controls/messBtn';
import { useIntl } from 'react-intl';
import Head from 'next/head';
import { useSetStaticData, useGetStaticData } from '../../store/store';
import { useEffect } from 'react';

export default function Layout({ children, navData, staticData }) {
  const intl = useIntl();
  const setStaticData = useSetStaticData();
  const getStaticData = useGetStaticData();
  useEffect(() => {
    setStaticData({ staticData });
  }, []);

  return (
    <>
      <Head>
        <title>{intl.formatMessage({ id: 'default.title' })}</title>
        <meta name="description" content={intl.formatMessage({ id: 'default.description' })} />
      </Head>
      <div className="wrapper">
        <InfoModal />
        <Header navData={navData} logo={staticData?.logo} />
        <main className="content">{children}</main>
        <Footer staticData={staticData} />
        <Burger logo={staticData?.logo} />
        <Modal />
        <ScrollTop />
        <MessBtn />
      </div>
    </>
  );
}
