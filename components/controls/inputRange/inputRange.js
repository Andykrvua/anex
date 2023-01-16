import { useState, useEffect, useRef } from 'react';
import { Range, getTrackBackground } from 'react-range';
import { useSetSearchFilter, useGetSearchFilter } from 'store/store';
import styles from './inputRange.module.css';

export default function InputRange({ min, max, val }) {
  const step = 5000;
  const [values, setValues] = useState(val);

  // useEffect(() => {
  //   setValues([min, max]);
  // }, [min, max]);

  const setFilterData = useSetSearchFilter();
  const filterData = useGetSearchFilter();

  // searchFilter: {
  //   btnTrigger: false,
  //   default: {
  //     change: [],
  //     cost: [0, 375000],
  //     hotelRating: {
  //       5: false,
  //       4: false,
  //       3: false,
  //     },
  //   },
  //   new: {
  //   },
  //   costMin: 0,
  //   costMax: 375000,
  //   test: 'hfhfhhf',
  // },

  function Test(values) {
    console.log('!!!!!!!!!!!!!', values);
    if (
      filterData.default.cost[0] === values[0] &&
      filterData.default.cost[1] === values[1]
    ) {
      console.log('===');
      console.log('filterData.default.cost[0]', filterData.default.cost[0]);
      console.log('filterData.newData?.cost[0]', values[0]);
      console.log('filterData.default.cost[1]', filterData.default.cost[1]);
      console.log('filterData.newData?.cost[1]', values[1]);
      setFilterData({
        btnTrigger: filterData.newData.change.filter((item) => item !== 'cost')
          .length
          ? true
          : false,
        default: filterData.default,
        newData: {
          ...filterData.newData,
          cost: values,
          change: filterData.newData.change.filter((item) => item !== 'cost'),
        },
      });
    } else {
      console.log('!==');
      console.log('filterData.default.cost[0]', filterData.default.cost[0]);
      console.log('filterData.newData?.cost[0]', values[0]);
      console.log('filterData.default.cost[1]', filterData.default.cost[1]);
      console.log('filterData.newData?.cost[1]', values[1]);

      setFilterData({
        btnTrigger: true,
        default: filterData.default,
        newData: {
          ...filterData.newData,
          cost: values,
          change: filterData.newData.change.length
            ? filterData.newData.change.includes('cost')
              ? [...filterData.newData.change]
              : [...filterData.newData.change, 'cost']
            : ['cost'],
        },
      });
    }
  }

  const onChangeHandler = (values) => {
    setValues(values);
    Test(values);
  };

  return (
    <div className={styles.wrapper}>
      <Range
        values={values}
        step={step}
        min={min}
        max={max}
        onChange={(values) => onChangeHandler(values)}
        // onChange={(val) => debouncedCallback(val)}
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
