import Link from 'next/link';

export default function Logo({ location = '', closeBurgerHandler = null }) {
  return (
    <div className={`logo ${location}`}>
      <Link href="/">
        <a className="logo_link" onClick={closeBurgerHandler}>
          <picture>
            <source
              srcSet="/assets/img/logo.webp"
              type="image/webp"
              alt="Логотип"
              width="150"
              height="58"
            />
            <img
              src="/assets/img/logo.svg"
              alt="Логотип"
              width="150"
              height="58"
            />
          </picture>
        </a>
      </Link>
    </div>
  );
}
