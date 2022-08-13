import Header from './header/header';
import Footer from './footer/footer';
import Modal from './modal';
import Burger from './burger/burger';
import InfoModal from './infoModal';

export default function Layout({ children }) {
  return (
    <div className="wrapper">
      <InfoModal />
      <Header />
      <main className="content">{children}</main>
      <Footer />
      <Burger />
      <Modal />
    </div>
  );
}
