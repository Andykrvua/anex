import Logo from './logo';
import UserArea from './userArea';
import BurgerBtn from './burgerBtn';
import Nav from './nav';
import { location } from 'utils/constants';
import { useState, useEffect, memo } from 'react';
import getViewport from 'utils/getViewport';
import SubnavCountry from './subnavCountry';

export default function Header({ navData }) {
  // country submenu offset left
  const [offsetLeft, setOffsetLeft] = useState(null);
  // country submenu variant
  const [isShow, setIsShow] = useState(true);
  // country submenu is open
  const [isOpen, setIsOpen] = useState(false);
  const windowSize = getViewport();

  useEffect(() => {
    if (!window.matchMedia('(min-width: 900px)').matches) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
    return () => {
      setIsShow(true);
    };
  }, [windowSize]);

  const MemoBurgerBtn = memo(BurgerBtn);
  const MemoUserArea = memo(UserArea);
  return (
    <header className="header" style={{ position: 'relative' }}>
      <div className="header_wrapper">
        <div className="container header_container">
          <MemoBurgerBtn />
          <Logo />
          {!isShow && (
            <Nav
              position={location.nav.desktop}
              setOffsetLeft={setOffsetLeft}
              setIsOpen={setIsOpen}
              windowSize={windowSize}
            />
          )}
          <MemoUserArea />
        </div>
      </div>
      {isShow && (
        <div className="container">
          <Nav position={location.nav.mobile} setIsOpen={setIsOpen} />
        </div>
      )}

      <SubnavCountry
        offsetLeft={offsetLeft}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        navData={navData}
        windowSize={windowSize}
      />
    </header>
  );
}
