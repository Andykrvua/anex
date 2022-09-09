import { useSession, signIn, signOut } from 'next-auth/react';

export default function Auth() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  console.log(session);
  const handleSignin = (e) => {
    e.preventDefault();
    signIn();
  };
  const handleSignout = (e) => {
    e.preventDefault();
    signOut();
  };
  return (
    <div>
      {session && (
        <a href="#" onClick={handleSignout} className="btn-signin">
          Sign out
        </a>
      )}
      {!session && (
        <a href="#" onClick={handleSignin} className="btn-signin">
          Sign in
        </a>
      )}
      {loading && <div>Loading...</div>}
      {session && (
        <>
          <p style={{ marginBottom: '10px' }}>
            Welcome, {session.user.name ?? session.user.email}
          </p>
          <br />
          <img
            src={session.user.image}
            alt=""
            style={{ height: '26px', width: '26px' }}
            referrerPolicy="no-referrer"
          />
        </>
      )}
      {!session && (
        <>
          <p>Please Sign in</p>
        </>
      )}
    </div>
  );
}
