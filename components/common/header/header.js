import Logo from './logo';
import UserArea from './userArea';
import BurgerBtn from './burgerBtn';
import Nav from './nav';
import { location } from 'utils/constants';
import { useState, useEffect } from 'react';

export default function Header() {
  const [offsetLeft, setOffsetLeft] = useState(null);
  const [test, setTest] = useState(null);

  useEffect(() => {
    setTest(offsetLeft);
  }, [offsetLeft]);

  return (
    <header className="header" style={{ position: 'relative' }}>
      <div className="header_wrapper">
        <div className="container header_container">
          <BurgerBtn />
          <Logo />
          <Nav position={location.nav.desktop} setOffsetLeft={setOffsetLeft} />
          <UserArea />
        </div>
      </div>
      <div className="container">
        <Nav position={location.nav.mobile} />
      </div>
      {/* <div
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
      </div> */}
    </header>
  );
}
