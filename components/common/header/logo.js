import Link from 'next/link';

export default function Logo({ location = '', closeBurgerHandler = null, logo = null }) {
  return (
    <div className={`logo ${location}`}>
      <Link href="/">
        <a className="logo_link" onClick={closeBurgerHandler}>
          <img
            src={logo ? `${process.env.NEXT_PUBLIC_API_img}${logo}` : '/assets/img/logo.svg'}
            alt="ANEX Tour"
            width="150"
            height="58"
          />
        </a>
      </Link>
    </div>
  );
}
