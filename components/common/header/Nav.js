import Link from 'next/link';
import SimpleBar from 'simplebar-react';

const NavContent = () => {
  return (
    <ul className="header_nav">
      <li>
        <Link href="/index2">
          <a className="header_nav_link">Туры</a>
        </Link>
      </li>
      <li>
        <Link href="/">
          <a className="header_nav_link">Страны</a>
        </Link>
      </li>
      <li>
        <Link href="/">
          <a className="header_nav_link">Горящие туры</a>
        </Link>
      </li>
      <li>
        <Link href="/">
          <a className="header_nav_link">Блог</a>
        </Link>
      </li>
      <li>
        <Link href="/">
          <a className="header_nav_link">Подберите мне тур</a>
        </Link>
      </li>
    </ul>
  );
};

export default function Nav({ location }) {
  return (
    <nav className={`header_nav_container ${location}`}>
      {location === 'mobile' ? (
        <SimpleBar style={{ maxWidth: 600, height: 30 }} autoHide={false}>
          <NavContent />
        </SimpleBar>
      ) : (
        <NavContent />
      )}
    </nav>
  );
}
