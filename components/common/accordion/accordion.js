import { useState } from 'react';
import styles from './accordion.module.css';

export default function Accordion({ data }) {
  const [state, setState] = useState(new Array(data.length).fill(true));

  const changeHandler = (ind) => {
    const newState = [...state];
    newState[ind] = !newState[ind];
    setState(newState);
  };

  return (
    <ul className={styles.accordion_wrapper}>
      {data.map((item, ind) => (
        <li key={ind} className={styles.accordion_item}>
          <input
            className={styles.accordion_input}
            type="checkbox"
            checked={state[ind]}
            onChange={() => changeHandler(ind)}
          />
          <h3 className={`${styles.accordion_title} no_select`}>
            <svg
              className={styles.accordion_icon}
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.5 11H6.5"
                stroke="#C3C3D0"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                className={styles.accordion_icon_line}
                d="M11 15.5L11 6"
                stroke="#C3C3D0"
                strokeWidth="0"
                strokeLinecap="round"
              />
              <circle cx="11" cy="11" r="10" stroke="#C3C3D0" strokeWidth="2" />
            </svg>
            <span className={styles.accordion_title_emojii}>
              {item.emoji || item.emojii}
            </span>
            {item.question}
          </h3>
          <div
            className={styles.text_content}
            dangerouslySetInnerHTML={{
              __html: item.answer,
            }}
          />
        </li>
      ))}
    </ul>
  );
}
