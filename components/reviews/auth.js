import { useSession, signIn, signOut } from 'next-auth/react';
import ReviewsPostControl from 'components/reviews/postControl';
import styles from './auth.module.css';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import Loader from 'components/common/loader';
import { useRef, useState, useEffect } from 'react';
import Script from 'next/script';

export default function Auth() {
  const { data: session, status } = useSession();
  const intl = useIntl();
  const loading = status === 'loading';
  const initialized = useRef(false);
  const fallbackBtnRef = useRef(null);
  // Fallback is shown when One Tap can't display the prompt (Edge/Opera) or
  // when the user dismissed it and Google's cooldown blocks re-prompting.
  const [showFallback, setShowFallback] = useState(false);

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
    if (!window.google) return;

    window.google.accounts.id.prompt((notification) => {
      // The prompt didn't reach a successful credential: either it never
      // displayed (browser_not_supported on Edge/Opera) or it was skipped /
      // dismissed by the user (cooldown after cancel). In all of these cases we
      // can't reliably re-prompt, so reveal the official "Sign in" button.
      const dismissedWithoutCredential =
        notification.isDismissedMoment?.() &&
        notification.getDismissedReason?.() !== 'credential_returned';

      if (
        notification.isNotDisplayed?.() ||
        notification.isSkippedMoment?.() ||
        dismissedWithoutCredential
      ) {
        setShowFallback(true);
      }
    });
  };

  // Render the official "Sign in with Google" button once the fallback is
  // requested. It reuses the `callback` registered in initialize(), so login
  // flows through the same googleonetap provider — no backend change. Unlike
  // One Tap, the button's popup works in every browser and has no cooldown.
  useEffect(() => {
    if (!showFallback || !window.google || !fallbackBtnRef.current) return;
    fallbackBtnRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(fallbackBtnRef.current, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
      text: 'continue_with',
      locale: intl.locale,
    });
  }, [showFallback, intl.locale]);

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
        {!session && !showFallback && (
          <a
            href="#"
            onClick={handleSignin}
            className={`${styles.login} apply_btn`}
          >
            <FM id="reviews.leave-feedback" />
          </a>
        )}
        {!session && showFallback && (
          <div ref={fallbackBtnRef} className={styles.fallback} />
        )}
        {loading && <Loader />}
      </div>
    </>
  );
}
