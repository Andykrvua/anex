import Header from './header/header';
import Footer from './footer/footer';
import Modal from './modal';
import Burger from './burger/burger';

export default function Layout({ children }) {
  return (
    <div className="wrapper">
      <Header />

      <main className="content">{children}</main>
      <Footer />
      <Burger />
      <Modal />
    </div>
  );
}
