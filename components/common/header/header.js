import Logo from './logo';
import UserArea from './userArea';
import BurgerBtn from './burgerBtn';
import Nav from './nav';
import { location } from 'utils/constants';
import { useState, useEffect, memo } from 'react';
import getViewport from 'utils/getViewport';

const CountrySubMenu = ({ test, offsetLeft, setTest }) => {
  useEffect(() => {
    setTest(offsetLeft);

    return () => {
      setTest(offsetLeft);
    };
  }, [offsetLeft]);
  return (
    <div
      id="countrylist"
      role="menu"
      aria-labelledby="countrylistbutton"
      style={{
        position: 'absolute',
        minWidth: '360px',
        height: '300px',
        left: `${test ? test : 30}px`,
        top: test ? '81px' : 'calc(100% - 25px)',
        backgroundColor: 'red',
      }}
    >
      22uaaduduuuudddaassss
    </div>
  );
};

export default function Header() {
  const [offsetLeft, setOffsetLeft] = useState(null);
  const [test, setTest] = useState(null);
  const [isShow, setIsShow] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  console.log(isOpen);

  const windowSize = getViewport();

  useEffect(() => {
    if (!window.matchMedia('(min-width: 900px)').matches) {
      setIsShow(true);
    } else {
      setIsShow(false);
    }
    return () => {
      setIsShow(false);
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
            />
          )}
          <MemoUserArea />
        </div>
      </div>
      <div className="container">
        {isShow && <Nav position={location.nav.mobile} />}
      </div>
      {isOpen && (
        <CountrySubMenu test={test} offsetLeft={offsetLeft} setTest={setTest} />
      )}
    </header>
  );
}
