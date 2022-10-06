import { useSession, signIn, signOut } from 'next-auth/react';
import ReviewsPostControl from 'components/reviews/postControl';
import styles from './auth.module.css';
import { FormattedMessage as FM } from 'react-intl';
import Loader from 'components/common/loader';

export default function Auth() {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

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
  );
}
