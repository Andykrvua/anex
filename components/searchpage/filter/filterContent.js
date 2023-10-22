import styles from './filterContent.module.css';
import { useEffect, useState, useRef } from 'react';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import { useGetSearchFilter, useSetSearchFilter, useGetHotelService } from 'store/store';
import InputRange from 'components/controls/inputRange/inputRange';
import Checkbox from 'components/controls/checkbox/checkbox';
import Accordion from 'components/controls/accordion/accordion';
import CloseSvg from 'components/common/closeSvg';
import { foodFilterItems } from 'utils/constants';

const Stars = (star) => {
  return new Array(parseInt(star)).fill(null).map((_, ind) => {
    return (
      <div className={styles.stars} key={ind}>
        <img src="/assets/img/svg/tour/star.svg" alt="star" width="12" height="12" />
      </div>
    );
  });
};

const hotelRatingItemsRating = [5, 4, 3];

const HotelRatingCheckbox = ({ rating, reset }) => {
  const filterData = useGetSearchFilter();
  const setFilterData = useSetSearchFilter();

  const initValues = () => {
    const currentURL = window.location.href;
    const newURL = new URL(currentURL);
    const currentPrice = newURL.searchParams.get('stars');

    if (currentPrice && currentPrice.split(',').includes(rating.toString())) {
      return true;
    }
    return false;
  };

  const [isCheckHotelStars, setIsCheckHotelStars] = useState(initValues());

  const checkHotelStarsHandler = (val) => {
    const paramName = 'stars';
    const currentURL = window.location.href;
    const newURL = new URL(currentURL);
    const stars = newURL.searchParams.get(paramName);
    if (!stars && val) {
      newURL.searchParams.set(paramName, rating);
      window.history.pushState({}, '', newURL.toString());
    }
    if (stars) {
      const currentStars = newURL.searchParams.get(paramName).split(',');
      if (currentStars.includes(rating.toString())) {
        const index = currentStars.indexOf(rating.toString());
        if (index !== -1) {
          currentStars.splice(index, 1);
        }
        newURL.searchParams.set(paramName, currentStars.join(','));
        window.history.pushState({}, '', newURL.toString());
      } else {
        newURL.searchParams.set(paramName, `${currentStars.join(',')},${rating}`);
        window.history.pushState({}, '', newURL.toString());
      }
    }

    setIsCheckHotelStars(val);
    // changeFilterState(val);
    setFilterData({ ...filterData, trigger: filterData.trigger + 1 });
  };

  useEffect(() => {
    if (reset) {
      setIsCheckHotelStars(false);
    }
  }, [reset]);

  // const changeFilterState = (val) => {
  //   if (filterData.default.hotelRating[rating] === !filterData.newData.hotelRating[rating]) {
  //     setFilterData({
  //       btnTrigger: filterData.newData.change.filter((item) => item !== rating).length ? true : false,
  //       default: filterData.default,
  //       newData: {
  //         ...filterData.newData,
  //         hotelRating: { ...filterData.newData.hotelRating, [rating]: val },
  //         change: filterData.newData.change.filter((item) => item !== rating),
  //       },
  //     });
  //   } else {
  //     setFilterData({
  //       btnTrigger: true,
  //       default: filterData.default,
  //       newData: {
  //         ...filterData.newData,
  //         hotelRating: { ...filterData.newData.hotelRating, [rating]: val },
  //         change: filterData.newData.change.includes(rating)
  //           ? [...filterData.newData.change]
  //           : [...filterData.newData.change, rating],
  //       },
  //     });
  //   }
  // };

  return <Checkbox label={Stars(rating)} check={isCheckHotelStars} setCheck={checkHotelStarsHandler} />;
};

const FilterCheckbox = ({ item, reset, isFood = false }) => {
  const filterData = useGetSearchFilter();
  const setFilterData = useSetSearchFilter();

  const initValues = () => {
    const paramName = Object.keys(item)[0];
    const currentURL = window.location.href;
    const newURL = new URL(currentURL);
    const currentPrice = newURL.searchParams.get(isFood ? 'food' : 'services');

    if (currentPrice && currentPrice.split(',').includes(paramName)) {
      return true;
    }
    return false;
  };

  const [isCheck, setIsCheck] = useState(initValues());
  // const [isCheck, setIsCheck] = useState(
  //   filterData.newData.change.includes(Object.keys(item).join) ? true : false
  // );

  const checkHandler = (val) => {
    const paramName = isFood ? 'food' : 'services';
    const paramValue = Object.keys(item)[0];
    const currentURL = window.location.href;
    const newURL = new URL(currentURL);
    const food = newURL.searchParams.get(paramName);
    if (!food && val) {
      newURL.searchParams.set(paramName, paramValue);
      window.history.pushState({}, '', newURL.toString());
    }
    if (food) {
      const currentFood = newURL.searchParams.get(paramName).split(',');
      if (currentFood.includes(paramValue)) {
        const index = currentFood.indexOf(paramValue);
        if (index !== -1) {
          currentFood.splice(index, 1);
        }
        newURL.searchParams.set(paramName, currentFood.join(','));
        window.history.pushState({}, '', newURL.toString());
      } else {
        newURL.searchParams.set(paramName, `${currentFood.join(',')},${paramValue}`);
        window.history.pushState({}, '', newURL.toString());
      }
    }

    setIsCheck(val);
    // changeFilterState(val);
    setFilterData({ ...filterData, trigger: filterData.trigger + 1 });
  };

  useEffect(() => {
    if (reset) {
      setIsCheck(false);
    }
  }, [reset]);

  // const changeFilterState = (val) => {
  //   let toggle = val;
  //   if (filterData.default.change.includes(Object.keys(item).join())) {
  //     toggle = !val;
  //   }
  //   setFilterData({
  //     btnTrigger: filterData.newData.change.filter((i) => i !== Object.keys(item).join()).length
  //       ? true
  //       : toggle
  //       ? true
  //       : false,
  //     default: filterData.default,
  //     newData: {
  //       ...filterData.newData,
  //       change: toggle
  //         ? [...filterData.newData.change, Object.keys(item).join()]
  //         : filterData.newData.change.filter((i) => i !== Object.keys(item).join()),
  //     },
  //   });
  // };

  return (
    <Checkbox
      label={<div className={styles.checkbox_text_wrapper}>{Object.values(item)}</div>}
      check={isCheck}
      setCheck={checkHandler}
    />
  );
};

export default function FilterContent({ mobile }) {
  const intl = useIntl();

  const filterData = useGetSearchFilter();
  const setFilterData = useSetSearchFilter();
  const getHotelService = useGetHotelService();
  const ref = useRef(0);

  const resetHandler = () => {
    ref.current++;

    const currentURL = window.location.href;
    const newURL = new URL(currentURL);
    newURL.searchParams.set('price', filterData.costMin);
    newURL.searchParams.set('priceTo', filterData.costMax);
    newURL.searchParams.set('stars', '');
    newURL.searchParams.set('food', '');
    newURL.searchParams.set('services', '');
    window.history.pushState({}, '', newURL.toString());
    setFilterData({ ...filterData, reset: true });
  };

  useEffect(() => {
    if (ref.current) {
      setFilterData({ ...filterData, reset: false });
    }
  }, [ref.current]);

  return (
    <>
      <div className={styles.filter_header}>
        {!mobile && (
          <h3 className={styles.title}>
            <FM id="result.filter.title" />
          </h3>
        )}
        <button className={`${styles.reset_btn} svg_btn_stroke`} onClick={resetHandler}>
          <FM id="result.filter.reset" />
          <CloseSvg />
        </button>
      </div>
      <div className={mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`}>
        <h4 className={styles.filter_parts_title}>
          <FM id="result.filter.bud" />
        </h4>
        <InputRange min={filterData.costMin} max={filterData.costMax} reset={filterData.reset} />
      </div>
      <div className={mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`}>
        <h4 className={styles.filter_parts_title}>
          <FM id="result.filter.cat_hotel" />
        </h4>
        <div className={mobile ? `${styles.filter_parts_row_stars}` : ''}>
          {hotelRatingItemsRating.map((rating, ind) => (
            <HotelRatingCheckbox key={ind} rating={rating} reset={filterData.reset} />
          ))}
        </div>
      </div>

      <div className={mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`}>
        <>
          <h4 className={styles.filter_parts_title}>
            <FM id="result.common.food" />
          </h4>
          {Object.entries(foodFilterItems).map(([key, val]) => {
            return (
              <FilterCheckbox
                key={key}
                item={{
                  [key]: intl.formatMessage({
                    id: val,
                  }),
                }}
                reset={filterData.reset}
                isFood
              />
            );
          })}
        </>
      </div>

      {getHotelService?.search &&
        getHotelService?.nameServices &&
        Object.entries(getHotelService?.search).map(([name, detailArr]) => {
          return (
            <div key={name} className={mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`}>
              {name === 'renovation' ? (
                <>
                  <Accordion title={getHotelService.nameServices[name]} open={false}>
                    {detailArr.map((item, ind) => {
                      return <FilterCheckbox key={ind} item={item} reset={filterData.reset} />;
                    })}
                  </Accordion>
                </>
              ) : (
                <>
                  <h4 className={styles.filter_parts_title}>
                    {getHotelService.nameServices && getHotelService.nameServices[name]}
                  </h4>
                  {detailArr.map((item, ind) => {
                    return <FilterCheckbox key={ind} item={item} reset={filterData.reset} />;
                  })}
                </>
              )}
            </div>
          );
        })}
    </>
  );
}
