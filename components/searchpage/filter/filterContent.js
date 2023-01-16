import styles from './filterContent.module.css';
import {
  useSetFilterOpen,
  useGetSearchFilter,
  useSetSearchFilter,
  useSetApplyFilter,
  useGetHotelService,
} from 'store/store';
import { FormattedMessage as FM } from 'react-intl';
import InputRange from 'components/controls/inputRange/inputRange';
import Checkbox from 'components/controls/checkbox/checkbox';
import { useIntl } from 'react-intl';
import Accordion from 'components/controls/accordion/accordion';
import CloseSvg from 'components/common/closeSvg';
import { useEffect, useState } from 'react';
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

const HotelRatingItem = ({ rating, ind }) => {
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

  const changeFilterState = (val) => {
    if (
      filterData.default.hotelRating[rating] ===
      !filterData.newData.hotelRating[rating]
    ) {
      console.log('inp ===');
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
      console.log('inp !==');
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
    // const trigger = filterData.newData.change.filter(
    //   (item) => item !== 'rating'
    // ).length
    //   ? true
    //   : false;

    // const temp = filterData.hotelRating.map((r, i) => {
    //   if (i === ind) {
    //     return (r = val);
    //   } else {
    //     return r;
    //   }
    // });

    // setFilterData({
    //   hotelRating: temp,
    //   btnTrigger: trigger ? true : temp.includes(true),
    //   change: temp.includes(true)
    //     ? filterData.change.includes('rating')
    //       ? filterData.change
    //       : [...filterData.change, 'rating']
    //     : filterData.change.filter((item) => item !== 'rating'),
    // });
  };

  return (
    <Checkbox
      label={Stars(rating)}
      check={isCheckHotelStars}
      setCheck={checkHotelStarsHandler}
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
  console.log(filterData);
  console.log('getHotelService', getHotelService);

  const filteredSearch = () => {
    // setFilterData({
    //   btnTrigger: false,
    //   cost: {
    //     min: filterData.cost.min,
    //     max: filterData.cost.max,
    //     values: filterData?.newCost.values
    //       ? filterData?.newCost.values
    //       : filterData?.cost.values,
    //   },
    // });
    setApplyFilter(true);
  };

  return (
    <>
      {filterData.btnTrigger && (
        <div className={styles.filter_btn}>
          <button onClick={() => filteredSearch()} style={{ padding: '15px' }}>
            Применить фильтры
          </button>
          <button
            onClick={() => {
              setApplyFilter(false);
              setFilterData({
                btnTrigger: false,
              });
            }}
            style={{ marginRight: '20px', padding: '15px' }}
          >
            Отмена
          </button>
        </div>
      )}
      <div className={styles.filter_header}>
        {!mobile && (
          <h3 className={styles.title}>
            <FM id="result.filter.title" />
          </h3>
        )}
        <button className={`${styles.reset_btn} svg_btn_stroke`}>
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
            <HotelRatingItem key={ind} rating={rating} ind={ind} />
          ))}
        </div>
      </div>
      {/* <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Транспорт</h4>
        <div className={styles.filter_parts_row}>
          <Checkbox
            label={
              <span className={styles.checkbox_icon_wrapper}>
                <img src="/assets/img/svg/fly-up.svg" alt="air" />
              </span>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <span className={styles.checkbox_icon_wrapper}>
                <img src="/assets/img/svg/results/bus.svg" alt="bus" />
              </span>
            }
            check={null}
            setCheck={null}
          />
        </div>
      </div> */}
      {/* <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Питание</h4>
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Без питания</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={<div className={styles.checkbox_text_wrapper}>Завтрак</div>}
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Завтрак и ужин</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Полный пансион</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Всё включено</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>
              Ультра всё включено
            </div>
          }
          check={null}
          setCheck={null}
        />
      </div> */}
      {/* <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Пляж</h4>
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Первая линия</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Вторая линия</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Собственный пляж</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Песчаный пляж</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Галечный пляж</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>
              Песчано-галечный пляж
            </div>
          }
          check={null}
          setCheck={null}
        />
      </div> */}
      {console.log('getHotelService', getHotelService)}
      {getHotelService?.search &&
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
              <h4 className={styles.filter_parts_title}>
                {getHotelService.nameServices[name]}
              </h4>
              {detailArr.map((item, ind) => {
                return (
                  <Checkbox
                    key={ind}
                    label={
                      <div className={styles.checkbox_text_wrapper}>
                        {Object.values(item)}
                      </div>
                    }
                    check={null}
                    setCheck={null}
                  />
                );
              })}
            </div>
          );
        })}

      {/* <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <h4 className={styles.filter_parts_title}>Пляж</h4>
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Первая линия</div>
          }
          check={null}
          setCheck={null}
        />
        <Checkbox
          label={
            <div className={styles.checkbox_text_wrapper}>Вторая линия</div>
          }
          check={null}
          setCheck={null}
        />
      </div> */}
      {/* <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <Accordion title={'В отеле'} open={false}>
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Бесплатный Wi-Fi
              </div>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Бассейн с подогревом
              </div>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Отель для взрослых
              </div>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Большая территория
              </div>
            }
            check={null}
            setCheck={null}
          />
        </Accordion>
      </div> */}
      {/* <div
        className={
          mobile ? `${styles.filter_parts_mobile}` : `${styles.filter_parts}`
        }
      >
        <Accordion title={'Для детей'} open={false}>
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>Детский клуб</div>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Детский бассейн
              </div>
            }
            check={null}
            setCheck={null}
          />
          <Checkbox
            label={
              <div className={styles.checkbox_text_wrapper}>
                Детское меню в ресторане
              </div>
            }
            check={null}
            setCheck={null}
          />
        </Accordion>
      </div> */}
    </>
  );
}
