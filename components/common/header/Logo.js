import Link from 'next/link';

export default function Logo() {
  return (
    <div className="logo">
      <Link href="/">
        <a className="logo_link">
          <picture>
            <source
              srcSet="/assets/img/logo.webp"
              type="image/webp"
              alt="Логотип"
              width="150"
              height="58"
            />
            <img
              src="/assets/img/logo.png"
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
