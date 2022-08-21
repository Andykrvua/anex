import Header from './header/header';
import Footer from './footer/footer';
import Modal from './modal';
import Burger from './burger/burger';
import InfoModal from './infoModal';

export default function Layout({ children, navData }) {
  return (
    <div className="wrapper">
      <InfoModal />
      <Header navData={navData} />
      <main className="content">{children}</main>
      <Footer />
      <Burger />
      <Modal />
    </div>
  );
}
