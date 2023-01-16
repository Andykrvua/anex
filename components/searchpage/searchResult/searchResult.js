// import styles from './'
import Loader from 'components/common/loader';
import { useEffect, useState, memo } from 'react';
import {
  useGetUp,
  useGetDown,
  useSetDown,
  useGetDate,
  useGetNight,
  useGetPerson,
  useGetUpPointList,
  useSetUpPointList,
  useSetSearchUrl,
  useSetSearchFilter,
  useGetSearchFilter,
  useGetStartSearch,
  useSetStartSearch,
  useSetSearchInProgress,
  useGetApplyFilter,
  useSetApplyFilter,
  useSetHotelService,
} from 'store/store';
import { useRouter } from 'next/router';
import Cards from './cards';

const MemoCards = memo(Cards);

export default function SearchResult() {
  // help data start
  const [hotels, setHotels] = useState('');
  const [offers, setOffers] = useState({});
  const [step, setStep] = useState(10);
  console.log(step);
  // help data end
  const router = useRouter();
  const loc = router.locale === 'uk' ? 'ua' : 'ru';

  const up = useGetUp();
  const down = useGetDown();
  const setDown = useSetDown();
  const date = useGetDate();
  const night = useGetNight();
  const person = useGetPerson();
  const upPointList = useGetUpPointList();
  const setUpPointList = useSetUpPointList();
  const setSearchUrl = useSetSearchUrl();
  const setFilterData = useSetSearchFilter();
  const filterData = useGetSearchFilter();
  const startSearch = useGetStartSearch();
  const setStartSearch = useSetStartSearch();
  const setSearchInProgress = useSetSearchInProgress();
  const applyFilter = useGetApplyFilter();
  const setApplyFilter = useSetApplyFilter();
  const setHotelService = useSetHotelService();

  const [error, setError] = useState(false);
  const [apiRes, setApiRes] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryHotelService, setCountryHotelService] = useState(false);

  async function getUrl(number) {
    const childs = new Array(parseInt(person.child))
      .fill(null)
      .map((_, ind) => {
        if (person.childAge[ind].toString().length === 1) {
          return '0' + person.childAge[ind].toString();
        } else {
          return person.childAge[ind].toString();
        }
      });
    const people = person.adult.toString() + childs.join('');

    const copiedDate = new Date(date.rawDate);
    copiedDate.setDate(copiedDate.getDate() + date.plusDays);

    const checkIn = date.rawDate.toISOString().substr(0, 10);
    const checkTo = copiedDate.toISOString().substr(0, 10);

    // need get available transport from point list before fetch results
    let upTransportAvailable;
    if (!upPointList.active) {
      const search = await fetch(
        `/api/endpoints/fromcities?geoId=${down.value}`
      ).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      });

      if (search?.ok) {
        setUpPointList({
          active: true,
          list: search.result.fromCities,
        });
      }
      upTransportAvailable = search.result.fromCities.filter(
        (item) => item.id === up.value.toString()
      );
    } else {
      upTransportAvailable = upPointList.list.filter(
        (item) => item.id === up.value.toString()
      );
    }
    const transport = upTransportAvailable.length
      ? upTransportAvailable[0].transport.join()
      : 'no';

    // let url = `https://api.otpusk.com/api/2.6/tours/getResults?number=${number}&lang=${loc}&transport=${transport}&from=${up.value}&to=${down.value}&checkIn=${checkIn}&checkTo=${checkTo}&nights=${night.from}&nightsTo=${night.to}&people=${people}&access_token=337da-65e22-26745-a251f-77b9e&services=one_line_beach`;
    let url = `https://api.otpusk.com/api/2.6/tours/getResults?number=${number}&lang=${loc}&transport=${transport}&from=${up.value}&to=${down.value}&checkIn=${checkIn}&checkTo=${checkTo}&nights=${night.from}&nightsTo=${night.to}&people=${people}&access_token=337da-65e22-26745-a251f-77b9e`;
    if (applyFilter) {
      const { newData } = filterData;
      if (
        newData.change.includes(5) ||
        newData.change.includes(4) ||
        newData.change.includes(3)
      ) {
        url += `&stars=${newData.change
          .filter((item) => item === 5 || item === 4 || item === 3)
          .join()}`;
      }
      if (newData.change.includes('cost')) {
        url += `&price=${newData.cost[0]}&priceTo=${newData.cost[1]}`;
      }

      setFilterData({
        ...filterData,
        btnTrigger: false,
        default: { ...newData },
        newData: { ...newData, change: [] },
      });
      setApplyFilter(false);
    }

    return url;
  }

  const search = async () => {
    setIsLoading(true);
    setSearchInProgress(true);
    await fetch(
      `https://api.otpusk.com/api/2.6/tours/services?countryId=${down.value}&lang=${loc}&access_token=337da-65e22-26745-a251f-77b9e`
    )
      .then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      })
      .then((data) => {
        setCountryHotelService(data);
        setHotelService(data);
      })
      .catch((e) => {
        // setError(true);
        console.log('error', e);
        return null;
      });

    let number = 0;
    async function apiSearch(number) {
      const url = await getUrl(number);
      setSearchUrl(url);
      const res = await fetch(url)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .catch((e) => {
          setError(true);
          console.log(e);
          setIsLoading(false);
          setSearchInProgress(false);
          setStartSearch(false);
          return null;
        });

      return res;
    }

    async function recursiveFetch(number) {
      setApiRes(false);
      setHotels(false);
      setOffers(false);
      setShow(false);
      console.log('start search');
      let data = await apiSearch(number);
      if (data) {
        console.log('res data', data);
        if (data.lastResult) {
          localStorage.setItem('result', JSON.stringify(data));
          setApiRes(data);
          setHotels(data.total);
          setOffers(data.workProgress);
          setShow(true);
          setIsLoading(false);
          setStartSearch(false);
          setSearchInProgress(false);
        } else {
          console.log('timeout');
          setTimeout(async () => {
            number++;
            await recursiveFetch(number);
          }, 5000);
        }
      } else {
        console.log('ne data');
      }
    }
    console.log('start recursiveFetch');
    await recursiveFetch(number);

    // console.log('data', data);
  };

  useEffect(() => {
    if (apiRes.lastResult) {
      // const priceArr = [];
      // Object.entries(apiRes.results).map(([operatorId, value]) => {
      //   Object.entries(value).map(([hotelId, data]) => {
      //     Object.entries(data.offers).map(([offerId, value]) => {
      //       priceArr.push(value.pl);
      //     });
      //   });
      // });
      // console.log('priceMin', Math.min(...priceArr));
      // console.log('priceMax', Math.max(...priceArr));
      // setFilterData({
      //   cost: {
      //     min: Math.floor(Math.min(...priceArr) / 5000) * 5000,
      //     max: Math.ceil(Math.max(...priceArr) / 5000) * 5000,
      //   },
      // });
    }
  }, [apiRes]);

  useEffect(() => {
    console.log('useeffect!!!!! search');
    if (startSearch) {
      search();
    } else {
      // ставим флаг в мейнформ если установили кверипараметры вручную
      // если флага нет, значит юзер ввел урл и тогда парсим и заполняем урл для поиска
      console.log('first visit');
    }
  }, []);

  useEffect(() => {
    if (applyFilter) {
      search();
    }
  }, [applyFilter]);
  // console.log('filterData', filterData);

  if (error) {
    return <h4>Error</h4>;
  }

  return (
    <div>
      <div>
        {/* <div>{JSON.stringify(up)}</div>
        <div>{JSON.stringify(down)}</div>
        <div>{JSON.stringify(date)}</div>
        <div>{JSON.stringify(night)}</div>
        <div>{JSON.stringify(person)}</div> */}
      </div>
      <button onClick={search}>search</button>
      {countryHotelService && (
        <div>
          Сервіси готелів:{' '}
          {JSON.stringify(countryHotelService.icons, null, '\t')}
          {console.log(countryHotelService)}
        </div>
      )}
      <div>Готелів всього: {hotels}</div>
      <div>Оферів всього: {JSON.stringify(offers, null, '\t')}</div>
      {isLoading && <Loader />}
      {show && apiRes.lastResult && (
        <MemoCards
          hotels={apiRes.hotels}
          offers={apiRes.results}
          step={step}
          countryHotelService={countryHotelService.icons}
        />
      )}
      {isLoading && <Loader />}
      <br />
      <button onClick={() => setStep((prev) => prev + 10)}>Next page</button>
    </div>
  );
}
