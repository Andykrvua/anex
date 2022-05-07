import styles from './switchMenu.module.css';
import { useRef, useEffect, useState, Fragment } from 'react';
import { switchMenuMargins } from '../../../utils/constants';

export default function SwitchMenu({ items, name, callback = null }) {
  const [width, setWidth] = useState([]);
  const [strJsx, setStrJsx] = useState('');

  const [get, set] = callback;

  const itemsRef = useRef([]);

  useEffect(() => {
    // get all el width
    itemsRef.current = itemsRef.current.slice(0, items.length);
    setWidth([...itemsRef.current].map((item) => item.offsetWidth));
  }, [items]);

  function step(arr, i) {
    // calculate translate for moving label
    if (i === 0) {
      return switchMenuMargins.lrMargin;
    } else {
      let indent = 0;
      arr.forEach((el, j) => {
        if (i > j) {
          indent = indent + el;
        }
      });
      indent += i * switchMenuMargins.insideMargin + switchMenuMargins.lrMargin;
      return indent;
    }
  }

  useEffect(() => {
    // create jsx
    if (width.length) {
      setStrJsx(
        width
          .map((item, i, arr) => {
            return `
              .switch input.${
                items[i].value
              }:checked ~ .switch_indicator_${name}{transform: translate3d(${step(
              arr,
              i
            )}px, 0, 0); width: ${item}px;}        
              .switch input.${items[i].value}:checked ~ .switch_label.${
              items[i].value
            }{color: var(--font-white);}`;
          })
          .join(' ')
      );
    }
  }, [width]);

  const handleChange = (e) => {
    if (callback) {
      set(e.target.value);
    }
  };

  return (
    <div className={`${styles.switch} switch`}>
      {items.map((item, i) => {
        return (
          <Fragment key={i}>
            <input
              name={name}
              id={`${item.value}`}
              type="radio"
              className={`${item.value}`}
              checked={get === item.value}
              onChange={handleChange}
              value={item.value}
            />
            <label
              htmlFor={`${item.value}`}
              className={`${styles.switch_label} ${item.value} switch_label`}
              ref={(el) => (itemsRef.current[i] = el)}
            >
              {item.name}
            </label>
          </Fragment>
        );
      })}
      <div
        className={`${styles.switch_indicator} switch_indicator_${name} `}
      ></div>
      {strJsx && <style>{strJsx}</style>}
    </div>
  );
}
