import styles from './tagsCountryList.module.css';
import Link from 'next/link';
import { useLayoutEffect, useRef, useState } from 'react';
import getViewport from 'utils/getViewport';

export default function TagsCountryList({ data }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const windowSize = getViewport();
  const list = useRef(null);
  const first = useRef(null);
  const last = useRef(null);

  const getHeight = () => {
    if (windowSize.width < 810) {
      // if it doesn't fit on one line
      if (first.current.offsetTop !== last.current.offsetTop) {
        list.current.classList.add('hidden');
        setIsVisible(true);
      } else {
        list.current.classList.remove('hidden');
        setIsVisible(false);
      }
    } else {
      list.current.classList.remove('hidden');
      setIsVisible(false);
    }
  };

  useLayoutEffect(() => {
    getHeight();
  }, [windowSize]);

  const openList = () => {
    list.current.classList.toggle('hidden_open');
    setIsOpen((prev) => !prev);
  };

  return (
    <div className={styles.tagscountry_list_wrapper}>
      <ul className={styles.tagscountry_list} ref={list}>
        {data.map((item, ind) => {
          return (
            <li key={ind} ref={ind === 0 ? first : last}>
              <Link href={item.url}>
                <a className={styles.tagscountry_item}>
                  <img
                    src={`/assets/img/svg/flags/${item.code}.svg`}
                    width="60"
                    height="43"
                    alt={item.title}
                  />
                  <span className={styles.tagscountry_item_title}>
                    {item.title}
                  </span>
                  <span className={styles.tagscountry_item_count}>
                    {item.count}
                  </span>
                </a>
              </Link>
            </li>
          );
        })}
      </ul>
      {isVisible && (
        <button
          className={
            isOpen ? `btn_down_open ${styles.btn_down}` : `${styles.btn_down}`
          }
          onClick={openList}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7 9.25L12 14.75L17 9.25"
              stroke="#53536E"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <style jsx>{`
        .hidden {
          height: 75px;
          overflow: hidden;
        }
        .hidden_open {
          height: auto;
          overflow: visible;
        }
        .btn_down_open {
          position: relative;
          bottom: auto;
          height: 24px;
          align-items: center;
          transform: rotate(180deg);
        }
      `}</style>
    </div>
  );
}
