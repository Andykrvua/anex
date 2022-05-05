import styles from './switchMenu.module.css';
import { useRef, useEffect, useState, Fragment } from 'react';

export default function SwitchMenu({ items, callback }) {
  const [width, setWidth] = useState([]);
  const [strJsx, setStrJsx] = useState('');

  const itemsRef = useRef([]);

  useEffect(() => {
    // get all el width
    itemsRef.current = itemsRef.current.slice(0, items.length);
    setWidth([...itemsRef.current].map((item) => item.offsetWidth));
  }, [items]);

  function step(arr, i) {
    // calculate translate for moving label
    if (i === 0) {
      return 5;
    } else {
      let removed = 0;
      arr.forEach((el, j) => {
        if (i > j) {
          removed = removed + el;
        }
      });
      removed += i * 10;
      removed += 5;
      return removed;
    }
  }

  useEffect(() => {
    // create jsx
    if (width.length) {
      setStrJsx(
        width
          .map((item, i, arr) => {
            return `
              .switch input.el${i}:checked ~ .switch_indicator {
                transform: translate3d(${step(arr, i)}px, 0, 0);
                width: ${item}px;
              }        
              .switch input.el${i}:checked ~ .switch_label.el${i} {
                color: var(--font-white);
              }        
            `;
          })
          .join(' ')
      );
    }
  }, [width]);

  const handleChange = (e) => {
    callback(e.target.value);
  };

  return (
    <div className={`${styles.switch} switch`}>
      {items.map((item, i) => {
        return (
          <Fragment key={i}>
            <input
              name="switch"
              id={`el${i}`}
              type="radio"
              className={`el${i}`}
              defaultChecked={i === 0}
              onChange={handleChange}
              value={item.value}
            />
            <label
              style={{ '--test': 'test' }}
              htmlFor={`el${i}`}
              className={`${styles.switch_label} el${i} switch_label`}
              ref={(el) => (itemsRef.current[i] = el)}
            >
              {item.name}
            </label>
          </Fragment>
        );
      })}
      <div className={`${styles.switch_indicator} switch_indicator `}></div>
      {strJsx && <style jsx>{strJsx}</style>}
    </div>
  );
}
