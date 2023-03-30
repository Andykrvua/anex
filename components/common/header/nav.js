import Link from 'next/link';
import SimpleBar from 'simplebar-react';
import { FormattedMessage as FM } from 'react-intl';
import { links } from 'utils/links';
import { location, modal } from 'utils/constants';
import { useRef, useEffect } from 'react';
import { useSetModal } from 'store/store';

const NavContent = ({ setOffsetLeft = null, setIsOpen, windowSize = null }) => {
  const elRef = useRef();
  const setModal = useSetModal();

  useEffect(() => {
    if (setOffsetLeft !== null) {
      setOffsetLeft(() => elRef.current.offsetLeft);
    }

    return () => {
      if (setOffsetLeft !== null) {
        setOffsetLeft(0);
      }
    };
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
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <FM id="nav.country" />
        </button>
      </li>
      {/* <li>
        <Link href={links.hotTours}>
          <a className="header_nav_link">
            <FM id="nav.hot_tour" />
          </a>
        </Link>
      </li> */}
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
        <Link href={links.faq}>
          <a className="header_nav_link">
            <FM id="nav.faq" />
          </a>
        </Link>
      </li>
      <li>
        <button
          className="header_nav_link"
          id="countrylistbutton"
          aria-haspopup="true"
          aria-controls="countrylist"
          expanded="false"
          onClick={() => setModal({ get: modal.leadGetTours })}
        >
          <FM id="nav.pick_tour" />
        </button>
      </li>
    </ul>
  );
};

export default function Nav({
  position,
  setOffsetLeft = null,
  setIsOpen,
  windowSize = null,
}) {
  return (
    <nav className={`header_nav_container ${position}`}>
      {position === location.nav.mobile ? (
        <SimpleBar style={{ maxWidth: 600, height: 35 }} autoHide={false}>
          <NavContent setIsOpen={setIsOpen} />
        </SimpleBar>
      ) : (
        <NavContent
          setOffsetLeft={setOffsetLeft}
          setIsOpen={setIsOpen}
          windowSize={windowSize}
        />
      )}
    </nav>
  );
}
