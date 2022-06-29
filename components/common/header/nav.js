import Link from 'next/link';
import SimpleBar from 'simplebar-react';
import { FormattedMessage as FM } from 'react-intl';
import { links } from 'utils/links';

const NavContent = () => {
  return (
    <ul className="header_nav">
      <li>
        <Link href={links.tours}>
          <a className="header_nav_link">
            <FM id="nav.tour" />
          </a>
        </Link>
      </li>
      <li>
        <Link href={links.countries}>
          <a className="header_nav_link">
            <FM id="nav.country" />
          </a>
        </Link>
      </li>
      <li>
        <Link href={links.hotTours}>
          <a className="header_nav_link">
            <FM id="nav.hot_tour" />
          </a>
        </Link>
      </li>
      <li>
        <Link href={links.blog}>
          <a className="header_nav_link">
            <FM id="nav.blog" />
          </a>
        </Link>
      </li>
      <li>
        <Link href={links.main}>
          <a className="header_nav_link">
            <FM id="nav.pick_tour" />
          </a>
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
