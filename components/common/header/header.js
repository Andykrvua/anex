import Logo from './logo';
import UserArea from './userArea';
import BurgerBtn from './burgerBtn';
import Nav from './nav';

// import { useUser, useLogin, useAddToCart } from 'store/store';

export default function Header() {
  // const user = useUser();
  // const login = useLogin();
  // const addToCart = useAddToCart(15);
  return (
    <header className="header">
      <div className="header_wrapper">
        <div className="container header_container">
          <BurgerBtn />
          <Logo />
          <Nav location={'desktop'} />
          <UserArea />
        </div>
        {/* {user}
        <button onClick={login}>log</button>
      <button onClick={() => addToCart(15)}>Add to card</button> */}
      </div>
      <div className="container">
        <Nav location={'mobile'} />
      </div>
    </header>
  );
}
