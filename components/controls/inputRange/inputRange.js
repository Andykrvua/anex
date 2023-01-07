import { useState, useEffect } from 'react';
import { Range, getTrackBackground } from 'react-range';
import styles from './inputRange.module.css';

export default function InputRange({ min, max, step }) {
  const [values, setValues] = useState([min, max]);

  useEffect(() => {
    setValues([min, max]);
  }, [min, max]);

  return (
    <div className={styles.wrapper}>
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={(values) => {
          setValues(values);
        }}
        renderTrack={({ props, children }) => (
          <div
            onMouseDown={props.onMouseDown}
            onTouchStart={props.onTouchStart}
            style={{
              ...props.style,
              height: '36px',
              display: 'flex',
              width: '100%',
              margin: '0 20px',
            }}
          >
            <div
              ref={props.ref}
              style={{
                height: '2px',
                width: '100%',
                borderRadius: '4px',
                background: getTrackBackground({
                  values,
                  colors: [
                    'var(--line)',
                    'var(--primary-light)',
                    'var(--line)',
                  ],
                  min,
                  max,
                }),
                alignSelf: 'center',
              }}
            >
              {children}
            </div>
          </div>
        )}
        renderThumb={({ props }) => (
          <div
            {...props}
            className={styles.thumb}
            style={{
              ...props.style,
            }}
          ></div>
        )}
      />
      <output className={styles.values} id="output">
        <span>{values[0].toLocaleString()}</span>
        <span>{values[1].toLocaleString()}</span>
      </output>
    </div>
  );
}
