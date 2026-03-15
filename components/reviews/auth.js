import { useSession, signIn, signOut } from 'next-auth/react';
import ReviewsPostControl from 'components/reviews/postControl';
import styles from './auth.module.css';
import { FormattedMessage as FM } from 'react-intl';
import Loader from 'components/common/loader';
import { useRef } from 'react';
import Script from 'next/script';

export default function Auth() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  const initialized = useRef(false);

  const initializeOneTap = () => {
    if (!window.google || initialized.current) return;
    initialized.current = true;

    window.google.accounts.id.initialize({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_ID,
      callback: (response) => {
        signIn('googleonetap', {
          credential: response.credential,
          redirect: false,
        });
      },
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: false,
    });
  };

  const handleSignin = (e) => {
    e.preventDefault();
    initializeOneTap();
    window.google.accounts.id.prompt();
  };

  const handleSignout = (e) => {
    e.preventDefault();
    signOut();
  };

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="lazyOnload"
        onLoad={initializeOneTap}
      />
      <div>
        {session && (
          <>
            <p className={styles.credentials}>
              <img
                src={session.user.image ?? null}
                alt="avatar"
                referrerPolicy="no-referrer"
              />
              <span className={styles.name}>
                {session.user.name ?? session.user.email}
              </span>
              <a href="#" onClick={handleSignout} className={styles.logout}>
                <FM id="common.logout" />
              </a>
            </p>

            <ReviewsPostControl
              name={session.user.name ?? session.user.email}
              avatar={session.user.image ?? null}
            />
          </>
        )}
        {!session && (
          <a
            href="#"
            onClick={handleSignin}
            className={`${styles.login} apply_btn`}
          >
            <FM id="reviews.leave-feedback" />
          </a>
        )}
        {loading && <Loader />}
      </div>
    </>
  );
}
