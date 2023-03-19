import { useEffect, useState, useRef } from 'react';
import styles from './turDetails.module.css';
import Loader from 'components/common/loader';

export default function DurationBlock({ offerData, data }) {
  const [datesRow, setDatesRow] = useState([]);
  const [datesRange, setDatesRange] = useState({ first: 0, last: 0 });
  const [nightsRange, setNightsRange] = useState([]);
  const [firstMatrixFill, setFirstMatrixFill] = useState(true);
  const [loading, setLoading] = useState(false);

  // res from api
  const [apiDataRes, setApiDataRes] = useState({});

  // is rec other dates offer send?
  const [isRecSend, setIsRecSend] = useState([]);

  // run request
  const [isFetch, setIsFetch] = useState(false);

  const gridEmptyColState = useRef(0);
  const gridColumns = 7;
  const gridRows = 5;
  const nightsMinMaxRange = [1, 30];

  const NewOffer = ({ nights, day, data }) => {
    let price = '';
    let current = false;
    if (offerData.d === day && offerData.nh === nights) {
      current = true;
    }

    if (apiDataRes[day]) {
      if (apiDataRes[day][nights]) {
        price = apiDataRes[day][nights].pl;
      }
    }
    return (
      <>
        {price ? (
          !current ? (
            <a
              className={styles.offer_link}
              href={`/hotels/${data.country}/${data.hotel}/?offer=${
                apiDataRes[day][nights].i
              }&transport=${data.transport}&from=${data.from}&fromname=${
                data.fromname
              }&to=${data.to}&checkIn=${apiDataRes[day][nights].d}&checkTo=${
                apiDataRes[day][nights].dt
              }&nights=${apiDataRes[day][nights].nh}&nightsTo=${
                apiDataRes[day][nights].nh + 5
              }&people=${data.people}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.offer_link_price}>
                {new Intl.NumberFormat('uk-UA', {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(price)}
              </span>

              <span className={styles.offer_link_curr}>грн</span>
            </a>
          ) : (
            <div className={styles.offer_link_current}>
              <span className={styles.offer_link_price}>
                {new Intl.NumberFormat('uk-UA', {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                }).format(price)}
              </span>

              <span className={styles.offer_link_curr}>грн</span>
            </div>
          )
        ) : (
          ''
        )}
      </>
    );
  };

  const ResultHandler = (apiData, dates, dRange, nRange, food) => {
    setIsRecSend((prev) => [
      ...prev,
      `${dates[dRange.first]}-${dates[dRange.last]}-${nRange[0]}-${
        nRange[nRange.length - 1]
      }`,
    ]);

    const matrixData = {};

    // parse api res from create all offers matrix data
    Object.entries(apiData).forEach(([operatorId, value]) => {
      Object.entries(value).forEach(([hotelId, data]) => {
        Object.entries(data.offers).forEach(([offerId, offerValue]) => {
          const dateStart = offerValue.d;
          const night = offerValue.nh;
          if (!matrixData[dateStart]) {
            matrixData[dateStart] = {};
          }
          if (!matrixData[dateStart][night]) {
            matrixData[dateStart][night] = [];
          }
          matrixData[dateStart][night].push(offerValue);
        });
      });
    });

    // find the same food and sort min price
    Object.entries(matrixData).forEach(([date, value]) => {
      Object.entries(value).forEach(([night, offers]) => {
        const sortedOffers = offers.sort((a, b) => a.pl - b.pl);
        const filteredOffers = sortedOffers.filter((item) => item.fn === food);
        matrixData[date][night] = filteredOffers.length
          ? filteredOffers[0]
          : sortedOffers[0];
      });
    });

    setApiDataRes((prevState) => {
      const newState = { ...prevState }; // copy old data
      Object.entries(matrixData).forEach(([newDate, newValues]) => {
        if (!newState[newDate]) {
          // if date not exist add new date obj
          newState[newDate] = newValues;
        } else {
          // if date exist check nights val
          Object.entries(newValues).forEach(([newNumber, newValue]) => {
            if (!newState[newDate][newNumber]) {
              // if night not exists add new night val
              newState[newDate][newNumber] = newValue;
            }
          });
        }
      });
      return { ...newState };
    });

    setIsFetch(false);
  };

  const fillMatrix = async (dates, dRange, nRange, data) => {
    const reply = isRecSend.includes(
      `${dates[dRange.first]}-${dates[dRange.last]}-${nRange[0]}-${
        nRange[nRange.length - 1]
      }`
    );
    if (reply) {
      setIsFetch(false);
      return;
    }

    setLoading(true);

    const postData = {
      from: data.from,
      to: data.hotelId,
      transport: data.transport,
      people: data.people,
      checkIn: dates[dRange.first],
      checkTo: dates[dRange.last],
      nights: nRange[0],
      nightsTo: nRange[nRange.length - 1],
    };
    const search = await fetch(`/api/endpoints/isOfferSearchVariants/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      body: JSON.stringify(postData),
    }).then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      return null;
    });

    if (search?.ok) {
      setLoading(false);
      ResultHandler(search.data.results, dates, dRange, nRange, offerData.fn);
    } else {
      setIsFetch(false);
      setLoading(false);
      console.log('api bad res');
    }
  };

  const calcNightsRow = () => {
    const nightRow = [];
    const currentNights = Number(offerData?.nh);

    if (
      currentNights - 2 >= nightsMinMaxRange[0] &&
      currentNights + 2 <= nightsMinMaxRange[1]
    ) {
      for (let i = 0; i < gridRows; i++) {
        nightRow.push(currentNights - 2 + i);
      }
    } else {
      for (let i = 1; i <= gridRows; i++) {
        nightRow.push(i);
      }
    }

    return nightRow;
  };

  function calcDatesRow() {
    // create dates array start tomorow
    // and day arive + 1 month
    const stopDate = new Date();
    stopDate.setHours(0, 0, 0, 0);
    // tomorow day
    stopDate.setDate(stopDate.getDate() + 1);
    // arive day
    const currDate = new Date(offerData.d);
    const result = [];
    const endDate = new Date(currDate);
    // arive day + 1 month
    endDate.setMonth(endDate.getMonth() + 1);
    while (stopDate <= currDate) {
      const formated = new Date(
        `${stopDate.getFullYear()}-${
          stopDate.getMonth() + 1
        }-${stopDate.getDate()}`
      )
        .toLocaleDateString('uk-UA')
        .split('.')
        .reverse()
        .join('-');
      result.push(formated);
      stopDate.setDate(stopDate.getDate() + 1);
    }
    while (currDate < endDate) {
      currDate.setDate(currDate.getDate() + 1);
      const formated = new Date(
        `${currDate.getFullYear()}-${
          currDate.getMonth() + 1
        }-${currDate.getDate()}`
      )
        .toLocaleDateString('uk-UA')
        .split('.')
        .reverse()
        .join('-');
      result.push(formated);
    }

    return result;
  }

  function getDateRange() {
    const ind = datesRow.indexOf(offerData.d);
    if (ind === -1) return;
    const first = ind <= 3 ? 0 : ind - 3;
    const last = first + 6;

    return { first: first, last: last };
  }

  const PrevDateRangeBtn = ({ datesRange, datesRow }) => {
    const first = () => {
      if (datesRange.first - 7 <= 0) {
        return 0;
      }
      return datesRange.first - 7;
    };

    const last = () => {
      return first() + 6;
    };

    const prev = () => {
      setDatesRange({ first: first(), last: last() });
      setIsFetch(true);
    };

    return (
      <button
        className={styles.btn_prev}
        onClick={prev}
        disabled={datesRange.first === 0 || loading ? true : false}
      >
        <span></span>
        {`${new Date(datesRow[first()]).toLocaleDateString('uk-UA', {
          day: '2-digit',
          month: '2-digit',
        })} - ${new Date(datesRow[last()]).toLocaleDateString('uk-UA', {
          day: '2-digit',
          month: '2-digit',
        })}`}
      </button>
    );
  };

  const NextDateRangeBtn = ({ datesRange, datesRow }) => {
    const length = datesRow.length;

    const first = () => {
      return datesRange.last + 7 >= length - 1
        ? length - gridColumns
        : datesRange.last + 1;
    };
    const last = () => {
      if (datesRange.last + 7 >= length - 1) {
        return length - 1;
      }
      return datesRange.last + 7;
    };
    const next = () => {
      setDatesRange({ first: first(), last: last() });
      setIsFetch(true);
    };

    return (
      <button
        className={styles.btn_next}
        onClick={next}
        disabled={
          datesRange.last === datesRow.length - 1 || loading ? true : false
        }
      >
        {`${new Date(datesRow[first()]).toLocaleDateString('uk-UA', {
          day: '2-digit',
          month: '2-digit',
        })} - ${
          last() === datesRow.length
            ? new Date(datesRow[datesRow.length - 1]).toLocaleDateString(
                'uk-UA',
                {
                  day: '2-digit',
                  month: '2-digit',
                }
              )
            : new Date(datesRow[last()]).toLocaleDateString('uk-UA', {
                day: '2-digit',
                month: '2-digit',
              })
        }`}
        <span></span>
      </button>
    );
  };

  const NextNightRangeBtn = ({ nightsRange }) => {
    const calcRange = () => {
      if (
        nightsRange[nightsRange.length - 1] + gridRows + 1 >=
        nightsMinMaxRange[1]
      ) {
        const arr = [];
        for (let i = gridRows - 1; i >= 0; i--) {
          arr.push(nightsMinMaxRange[1] - i);
        }
        return arr;
      } else {
        const arr = [];
        for (let i = 1; i <= gridRows; i++) {
          arr.push(nightsRange[nightsRange.length - 1] + i);
        }
        return arr;
      }
    };

    const next = () => {
      setNightsRange(calcRange());
      setIsFetch(true);
    };

    const range = calcRange();

    return (
      <button
        className={styles.btn_night_next}
        onClick={next}
        disabled={
          nightsRange[nightsRange.length - 1] === nightsMinMaxRange[1] ||
          loading
        }
      >
        <span></span>
        {range[0]}-{range[range.length - 1]} ночей
      </button>
    );
  };

  const PrevNightRangeBtn = ({ nightsRange }) => {
    const calcRange = () => {
      if (nightsRange[1] - gridRows > nightsMinMaxRange[0]) {
        const arr = [];
        for (let i = gridRows; i > 0; i--) {
          arr.push(nightsRange[0] - i);
        }
        return arr;
      } else {
        const arr = [];
        for (let i = 1; i <= gridRows; i++) {
          arr.push(i);
        }
        return arr;
      }
    };

    const prev = () => {
      setNightsRange(calcRange());
      setIsFetch(true);
    };

    const range = calcRange();

    return (
      <button
        className={styles.btn_night_prev}
        onClick={prev}
        disabled={nightsRange[0] === nightsMinMaxRange[0] || loading}
      >
        {range[0]}-{range[range.length - 1]} ночей
        <span></span>
      </button>
    );
  };

  useEffect(() => {
    setDatesRow(calcDatesRow());
  }, []);

  useEffect(() => {
    if (datesRow.length) {
      setDatesRange(getDateRange());
      setNightsRange(calcNightsRow());
    }
  }, [datesRow]);

  useEffect(() => {
    // run on click date range and night range btns
    if (isFetch) {
      fillMatrix(datesRow, datesRange, nightsRange, data);
    }
  }, [isFetch]);

  useEffect(() => {
    if (nightsRange.length) {
      if (firstMatrixFill) {
        fillMatrix(datesRow, datesRange, nightsRange, data);
        setFirstMatrixFill(false);
      }
    }
  }, [nightsRange]);

  return (
    <div className={styles.dates_block_wrapper}>
      <div className={styles.dates_block_loader_wrapper}>
        <div className={styles.dates_block}>
          <div className={styles.dates_block_cell}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="var(--primary-light)"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19.5 3h-3V1.5H15V3H9V1.5H7.5V3h-3A1.502 1.502 0 0 0 3 4.5v15A1.501 1.501 0 0 0 4.5 21h15a1.502 1.502 0 0 0 1.5-1.5v-15A1.502 1.502 0 0 0 19.5 3Zm-15 1.5h3V6H9V4.5h6V6h1.5V4.5h3v3h-15v-3Zm0 4.5h3.75v4.5H4.5V9Zm9.75 10.5h-4.5V15h4.5v4.5Zm0-6h-4.5V9h4.5v4.5Zm1.5 6V15h3.75v4.5h-3.75Z"></path>
            </svg>
          </div>
          {datesRange &&
            datesRow.map((item, ind) => {
              if (ind === 0) {
                gridEmptyColState.current = 0;
              }
              if (ind >= datesRange.first && ind <= datesRange.last) {
                gridEmptyColState.current++;
                return (
                  <div key={ind} className={styles.dates_block_cell}>
                    {new Date(item).toLocaleDateString('uk-UA', {
                      day: '2-digit',
                      month: '2-digit',
                    })}
                  </div>
                );
              }
            })}
          {datesRange &&
            new Array(gridColumns - gridEmptyColState.current)
              .fill(0)
              .map((item, ind) => {
                // create empty columns if need
                return <div key={ind} className={styles.dates_block_cell} />;
              })}
          {datesRange &&
            //create rows
            nightsRange.map((night, nightInd) => {
              return new Array(gridColumns + 1)
                .fill(0)
                .map((dates, datesInd) => {
                  return (
                    <div className={styles.dates_block_cell} key={datesInd}>
                      {datesInd === 0 && night}
                      <span>{datesInd === 0 && 'ночей'}</span>
                      {datesInd !== 0 && (
                        <NewOffer
                          nights={night}
                          day={datesRow[datesRange.first + datesInd - 1]}
                          data={data}
                        />
                      )}
                    </div>
                  );
                });
            })}
        </div>
        {loading && <Loader view={'absolute'} />}
      </div>
      <div className={styles.dates_block_btns}>
        <PrevDateRangeBtn datesRange={datesRange} datesRow={datesRow} />
        <NextDateRangeBtn datesRange={datesRange} datesRow={datesRow} />
      </div>
      <div className={styles.dates_block_btns}>
        <PrevNightRangeBtn nightsRange={nightsRange} />
        <NextNightRangeBtn nightsRange={nightsRange} />
      </div>
    </div>
  );
}
