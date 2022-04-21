import Header from './header/Header';
import Footer from './footer/Footer';

export default function Layout({ children }) {
  return (
    <div className="wrapper">
      <Header />
      <main className="content">{children}</main>
      <Footer />
    </div>
  );
}
