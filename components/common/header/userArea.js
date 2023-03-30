import { useSetModal } from 'store/store';
import { modal } from 'utils/constants';

export default function UserArea() {
  const setModal = useSetModal();

  return (
    <div className="user_area">
      <button
        className="svg_btn"
        onClick={() => setModal({ get: modal.leadRequestCall })}
        aria-label="Телефоны"
      >
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M30.789 26.666a.948.948 0 0 0-.5-.682l-4.013-2.365-.033-.019a1.193 1.193 0 0 0-.542-.126c-.337 0-.658.128-.88.351l-1.185 1.185a.694.694 0 0 1-.266.12c-.014 0-1.379-.099-3.891-2.611-2.508-2.508-2.615-3.877-2.616-3.877a.633.633 0 0 1 .12-.285l1.01-1.01c.356-.357.463-.948.252-1.407l-2.232-4.197a.922.922 0 0 0-.826-.54.951.951 0 0 0-.672.288L11.76 14.24a2.11 2.11 0 0 0-.541 1.091c-.024.177-.513 4.394 5.27 10.177 4.908 4.908 8.735 5.29 9.792 5.29.13.001.258-.005.386-.02a2.11 2.11 0 0 0 1.09-.54l2.75-2.75a.948.948 0 0 0 .281-.82Z" />
        </svg>
      </button>
      <button className="svg_btn" aria-label="Избранные туры" onClick={() => setModal({ get: modal.favorites })}>
        <svg
          width="42"
          height="42"
          viewBox="0 0 42 42"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M21 8C13.82 8 8 13.82 8 21s5.82 13 13 13 13-5.82 13-13S28.18 8 21 8Zm0 24.05a11.052 11.052 0 1 1 .001-22.103A11.052 11.052 0 0 1 21 32.05Zm0-10.4c-3.95 0-7.15 2.246-7.15 4.55s3.2 4.55 7.15 4.55 7.15-2.246 7.15-4.55-3.2-4.55-7.15-4.55Zm0-.65a3.9 3.9 0 1 0 0-7.8 3.9 3.9 0 0 0 0 7.8Z" />
          <rect x="26" y="10" width="10" height="10" rx="5" fill="#F6F6F6" />
          <path
            d="M32.933 12a2.162 2.162 0 0 0-1.55.655l-.32.329-.322-.33a2.162 2.162 0 0 0-3.1 0 2.275 2.275 0 0 0 0 3.166l3.423 3.492 3.42-3.492a2.275 2.275 0 0 0 0-3.165 2.164 2.164 0 0 0-1.55-.655Z"
            fill="url(#a)"
          />
          <defs style={{color: 'green'}}>
            <linearGradient
              id="a"
              x1="27.102"
              y1="5.268"
              x2="38.632"
              y2="7.505"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset=".241" stopColor="#FF9400" />
              <stop offset="1" stopColor="#FF1821" />
            </linearGradient>
          </defs>
        </svg>
      </button>
    </div>
  );
}
