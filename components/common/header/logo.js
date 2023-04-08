import Link from 'next/link';

export default function Logo({ location = '', closeBurgerHandler = null }) {
  return (
    <div className={`logo ${location}`}>
      <Link href="/">
        <a className="logo_link" onClick={closeBurgerHandler}>
          <img
            src="/assets/img/logo.svg"
            alt="Логотип"
            width="150"
            height="58"
          />
        </a>
      </Link>
    </div>
  );
}
