// import {
//   useLogin,
//   useLogout,
//   useAddToCart,
//   useUser,
//   useCartCount,
//   usefirstName,
//   useSetFirstName,
// } from '../store/store';
import { useEffect } from 'react';

// const LoginSection = () => {
//   const login = useLogin();
//   const logout = useLogout();
//   const firstName = usefirstName();
//   const setFirstName = useSetFirstName(firstName);
//   return (
//     <div>
//       <button onClick={login}>Login</button>
//       <button onClick={logout}>Logout</button>
//       <div>{firstName}</div>
//       <input type="text" onChange={(e) => setFirstName(e.target.value)} />
//     </div>
//   );
// };

// const AddToCardSection = () => {
//   const addToCart = useAddToCart(15);
//   return (
//     <div>
//       <button onClick={() => addToCart(15)}>Add to card</button>
//     </div>
//   );
// };

// const UserSection = () => {
//   const user = useUser();
//   return <div>User: {user}</div>;
// };

// const CartCountSection = () => {
//   const cartCount = useCartCount();
//   console.log(cartCount);
//   return <div>Cart: {cartCount}</div>;
// };

export default function Home() {
  useEffect(async () => {
    fetch('https://a-k.name/directus/items/posts')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  }, []);

  return (
    <div className="container">
      {/* <LoginSection />
      <UserSection />
      <AddToCardSection />
      <CartCountSection /> */}
      <h1>dsadsad</h1>
      <button>+</button>
      <button>-</button>
      <button>lllll</button>
    </div>
  );
}
