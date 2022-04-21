import Link from 'next/link';

export default function Logo() {
  return (
    <div className="logo">
      <Link href="/">
        <a className="logo_link">
          <img
            src="/assets/img/logo.webp"
            alt="Логотип"
            width="150"
            height="58"
          />
        </a>
      </Link>
    </div>
  );
}
