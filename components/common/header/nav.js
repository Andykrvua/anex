import Link from 'next/link';
import SimpleBar from 'simplebar-react';
import { FormattedMessage as FM } from 'react-intl';
import { links } from 'utils/links';
import { location } from 'utils/constants';
import { useRef, useEffect } from 'react';
import getViewport from 'utils/getViewport';

const NavContent = ({ setOffsetLeft = null }) => {
  const windowSize = getViewport();
  const elRef = useRef();

  useEffect(() => {
    if (setOffsetLeft !== null) {
      setOffsetLeft(() => elRef.current.offsetLeft);
    }
  }, [windowSize]);

  return (
    <ul className="header_nav">
      <li ref={elRef}>
        <button
          className="header_nav_link"
          id="countrylistbutton"
          aria-haspopup="true"
          aria-controls="countrylist"
          expanded="false"
        >
          <FM id="nav.country" />
        </button>
      </li>
      <li>
        <Link href={links.hotTours}>
          <a className="header_nav_link">
            <FM id="nav.hot_tour" />
          </a>
        </Link>
      </li>
      <li>
        <Link href={links.reviews}>
          <a className="header_nav_link">
            <FM id="nav.review" />
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

export default function Nav({ position, setOffsetLeft = null }) {
  return (
    <nav className={`header_nav_container ${position}`}>
      {position === location.nav.mobile ? (
        <SimpleBar style={{ maxWidth: 600, height: 30 }} autoHide={false}>
          <NavContent setOffsetLeft={setOffsetLeft} />
        </SimpleBar>
      ) : (
        <NavContent setOffsetLeft={setOffsetLeft} />
      )}
    </nav>
  );
}
