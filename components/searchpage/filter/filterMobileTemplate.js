import styles from './filterMobileTemplate.module.css';
import { useSetFilterOpen } from 'store/store';
import { FormattedMessage as FM } from 'react-intl';

export default function FilterMobileTemplate({ children }) {
  const setFilterModale = useSetFilterOpen();
  return (
    <div className="popup_wrapper">
      <div
        className="main_form_popup_mobile_wrapper"
        style={{ overflow: 'hidden' }}
      >
        <header className={styles.header_popup_header}>
          <button
            className={`${styles.header_popup_close} svg_btn`}
            aria-label="Закрыть"
            onClick={() => setFilterModale(false)}
          >
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M30 22a1 1 0 1 0 0-2v2Zm-18.707-1.707a1 1 0 0 0 0 1.414l6.364 6.364a1 1 0 0 0 1.414-1.414L13.414 21l5.657-5.657a1 1 0 0 0-1.414-1.414l-6.364 6.364ZM30 20H12v2h18v-2Z"></path>
            </svg>
          </button>
          <div className={styles.header_header_label}>
            <svg
              width="26"
              height="26"
              viewBox="0 0 26 26"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.5 6C9.76522 6 10.0196 6.10536 10.2071 6.29289C10.3946 6.48043 10.5 6.73478 10.5 7V9C10.5 9.26522 10.3946 9.51957 10.2071 9.70711C10.0196 9.89464 9.76522 10 9.5 10C9.23478 10 8.98043 9.89464 8.79289 9.70711C8.60536 9.51957 8.5 9.26522 8.5 9V7C8.5 6.73478 8.60536 6.48043 8.79289 6.29289C8.98043 6.10536 9.23478 6 9.5 6V6Z"
                fill="#53536E"
                stroke="#53536E"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.5 8H10.5"
                stroke="#53536E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 8H5.5"
                stroke="#53536E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.5 16C9.76522 16 10.0196 16.1054 10.2071 16.2929C10.3946 16.4804 10.5 16.7348 10.5 17V19C10.5 19.2652 10.3946 19.5196 10.2071 19.7071C10.0196 19.8946 9.76522 20 9.5 20C9.23478 20 8.98043 19.8946 8.79289 19.7071C8.60536 19.5196 8.5 19.2652 8.5 19V17C8.5 16.7348 8.60536 16.4804 8.79289 16.2929C8.98043 16.1054 9.23478 16 9.5 16Z"
                fill="#53536E"
                stroke="#53536E"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.5 18H10.5"
                stroke="#53536E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 18H5.5"
                stroke="#53536E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.5 11C17.7652 11 18.0196 11.1054 18.2071 11.2929C18.3946 11.4804 18.5 11.7348 18.5 12V14C18.5 14.2652 18.3946 14.5196 18.2071 14.7071C18.0196 14.8946 17.7652 15 17.5 15C17.2348 15 16.9804 14.8946 16.7929 14.7071C16.6054 14.5196 16.5 14.2652 16.5 14V12C16.5 11.7348 16.6054 11.4804 16.7929 11.2929C16.9804 11.1054 17.2348 11 17.5 11V11Z"
                fill="#53536E"
                stroke="#53536E"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16.5 13H5.5"
                stroke="#53536E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21.5 13H18.5"
                stroke="#53536E"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </header>
        <h3 className="title">
          <FM id="result.filter.title" />
        </h3>
        <div
          className={`${styles.filter_content} popup_scrollable_content filter_scrollable`}
        >
          {children}
        </div>
        <div className="apply_btn_wrapper">
          <button className="apply_btn">
            <FM id="common.apply" />
          </button>
        </div>
      </div>
    </div>
  );
}
