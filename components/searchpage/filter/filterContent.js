import styles from './filterContent.module.css';
import {
  useSetFilterOpen,
  useGetSearchFilter,
  useSetSearchFilter,
  useSetApplyFilter,
  useGetHotelService,
} from 'store/store';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import InputRange from 'components/controls/inputRange/inputRange';
import Checkbox from 'components/controls/checkbox/checkbox';
import Accordion from 'components/controls/accordion/accordion';
import CloseSvg from 'components/common/closeSvg';
import { foodFilterItems } from 'utils/constants';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/router';

const Stars = (star) => {
  return new Array(parseInt(star)).fill(null).map((_, ind) => {
    return (
      <div className={styles.stars} key={ind}>
        <img
          src="/assets/img/svg/tour/star.svg"
          alt="star"
          width="12"
          height="12"
        />
      </div>
    );
  });
};

const hotelRatingItemsRating = [5, 4, 3];

const HotelRatingCheckbox = ({ rating, reset }) => {
  const filterData = useGetSearchFilter();
  const setFilterData = useSetSearchFilter();
  const [isCheckHotelStars, setIsCheckHotelStars] = useState(
    filterData.newData.hotelRating[rating]
      ? filterData.newData.hotelRating[rating]
      : filterData.default.hotelRating[rating]
  );

  const checkHotelStarsHandler = (val) => {
    setIsCheckHotelStars(val);
    changeFilterState(val);
  };

  useEffect(() => {
    if (reset) {
      setIsCheckHotelStars(false);
    }
  }, [reset]);

  const changeFilterState = (val) => {
    if (
      filterData.default.hotelRating[rating] ===
      !filterData.newData.hotelRating[rating]
    ) {
      setFilterData({
        btnTrigger: filterData.newData.change.filter((item) => item !== rating)
          .length
          ? true
          : false,
        default: filterData.default,
        newData: {
          ...filterData.newData,
          hotelRating: { ...filterData.newData.hotelRating, [rating]: val },
          change: filterData.newData.change.filter((item) => item !== rating),
        },
      });
    } else {
      setFilterData({
        btnTrigger: true,
        default: filterData.default,
        newData: {
          ...filterData.newData,
          hotelRating: { ...filterData.newData.hotelRating, [rating]: val },
          change: filterData.newData.change.includes(rating)
            ? [...filterData.newData.change]
            : [...filterData.newData.change, rating],
        },
      });
    }
  };

  return (
    <Checkbox
      label={Stars(rating)}
      check={isCheckHotelStars}
      setCheck={checkHotelStarsHandler}
    />
  );
};

const FilterCheckbox = ({ item, reset }) => {
  const filterData = useGetSearchFilter();
  const setFilterData = useSetSearchFilter();
  const [isCheck, setIsCheck] = useState(
    filterData.newData.change.includes(Object.keys(item).join) ? true : false
  );

  const checkHandler = (val) => {
    setIsCheck(val);
    changeFilterState(val);
  };

  useEffect(() => {
    if (reset) {
      setIsCheck(false);
    }
  }, [reset]);

  const changeFilterState = (val) => {
    let toggle = val;
    if (filterData.default.change.includes(Object.keys(item).join())) {
      toggle = !val;
    }
    setFilterData({
      btnTrigger: filterData.newData.change.filter(
        (i) => i !== Object.keys(item).join()
      ).length
        ? true
        : toggle
        ? true
        : false,
      default: filterData.default,
      newData: {
        ...filterData.newData,
        change: toggle
          ? [...filterData.newData.change, Object.keys(item).join()]
          : filterData.newData.change.filter(
              (i) => i !== Object.keys(item).join()
            ),
      },
    });
  };

  return (
    <Checkbox
      label={
        <div className={styles.checkbox_text_wrapper}>
          {Object.values(item)}
        </div>
      }
      check={isCheck}
      setCheck={checkHandler}
    />
  );
};

export default function FilterContent({ mobile }) {
  const intl = useIntl();
  const router = useRouter();

  const filterData = useGetSearchFilter();
  const setFilterData = useSetSearchFilter();
  const setApplyFilter = useSetApplyFilter();
  const getHotelService = useGetHotelService();
  const ref = useRef(0);

  const resetHandler = () => {
    ref.current++;

    setFilterData({
      btnTrigger: false,
      default: {
        change: [],
        cost: [0, 375000],
        hotelRating: {
          5: false,
          4: false,
          3: false,
        },
      },
      newData: {
        change: [],
        cost: [],
        hotelRating: {
          5: false,
          4: false,
          3: false,
        },
      },
      costMin: 0,
      costMax: 375000,
      reset: true,
    });
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
        <button
          className={`${styles.reset_btn} svg_btn_stroke`}
          onClick={resetHandler}
        >
          <FM id="result.filter.reset" />
          <CloseSvg />
        </button>
      </div>
      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        {/* FILTER START */}
        <h4 className={styles.filter_parts_title}>Бюджет</h4>
        <InputRange
          min={filterData.costMin}
          max={filterData.costMax}
          val={
            filterData.new?.cost
              ? filterData.default.cost
              : filterData.default.cost
          }
          reset={filterData.reset}
        />
      </div>
      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Категория отеля</h4>
        <div className={mobile ? `${styles.filter_parts_row_stars}` : ''}>
          {hotelRatingItemsRating.map((rating, ind) => (
            <HotelRatingCheckbox
              key={ind}
              rating={rating}
              reset={filterData.reset}
            />
          ))}
        </div>
      </div>

      <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <>
          <h4 className={styles.filter_parts_title}>Питание</h4>
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
              />
            );
          })}
        </>
      </div>

      {getHotelService?.search &&
        getHotelService?.nameServices &&
        Object.entries(getHotelService?.search).map(([name, detailArr]) => {
          return (
            <div
              key={name}
              className={
                mobile
                  ? `${styles.filter_parts_mobile}`
                  : `${styles.filter_parts}`
              }
            >
              {name === 'renovation' ? (
                <>
                  <Accordion
                    title={getHotelService.nameServices[name]}
                    open={false}
                  >
                    {detailArr.map((item, ind) => {
                      return (
                        <FilterCheckbox
                          key={ind}
                          item={item}
                          reset={filterData.reset}
                        />
                      );
                    })}
                  </Accordion>
                </>
              ) : (
                <>
                  <h4 className={styles.filter_parts_title}>
                    {getHotelService.nameServices &&
                      getHotelService.nameServices[name]}
                  </h4>
                  {detailArr.map((item, ind) => {
                    return (
                      <FilterCheckbox
                        key={ind}
                        item={item}
                        reset={filterData.reset}
                      />
                    );
                  })}
                </>
              )}
            </div>
          );
        })}
    </>
  );
}
