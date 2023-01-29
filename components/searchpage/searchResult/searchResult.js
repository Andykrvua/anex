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
  useSetSearchResultSort,
  useGetSearchResultSort,
} from 'store/store';
import { useRouter } from 'next/router';
import parseUrl from '../pasteUrl/pasteUrl';
import Cards from './cards';

const MemoCards = memo(Cards);

export default function SearchResult() {
  // help data start
  const [step, setStep] = useState(10);
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

  const setSearchResultSort = useSetSearchResultSort();
  const getSearchResultSort = useGetSearchResultSort();

  const [error, setError] = useState(false);
  const [apiRes, setApiRes] = useState(false);
  const [apiData, setApiData] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryHotelService, setCountryHotelService] = useState(false);

  const ResultHandler = (apiData) => {
    if (!apiData) return;

    Object.entries(apiData.hotels).map(([hotelId, item]) => {
      Object.entries(apiData.results).map(([offerOperatorId, value]) => {
        return Object.entries(value).map(([offerHotelId, data]) => {
          if (offerHotelId === hotelId) {
            item.actualOffers = [];
            Object.entries(data.offers).map(([offerId, value]) => {
              item.actualOffers.push(value);
            });
          }
        });
      });
    });

    apiData.hotelsArr = [];
    Object.entries(apiData.hotels).map(([hotelId, item]) => {
      apiData.hotelsArr.push(item);
    });

    // hotel.actualOffers.sort(function (a, b) {
    //   return a.pl - b.pl;
    // });

    apiData.hotelsArr.map((item) => {
      item.actualOffers.sort(function (a, b) {
        return a.pl - b.pl;
      });
    });

    // apiData.hotelsArr.sort(function (a, b) {
    //   return a.actualOffers[0].pl - b.actualOffers[0].pl;
    // });

    // apiData.hotelsArr.sort(function (a, b) {
    //   return b.r - a.r;
    // });

    console.log('ResultHandler', apiData);
    setApiData(apiData);
    // return apiData;
  };

  console.log('apiData', apiData);

  useEffect(() => {
    if (getSearchResultSort.price.active) {
      const arr = apiData.hotelsArr;
      if (!arr) return;

      arr.sort(function (a, b) {
        return getSearchResultSort.price.dir === 'asc'
          ? a.actualOffers[0].pl - b.actualOffers[0].pl
          : b.actualOffers[0].pl - a.actualOffers[0].pl;
      });

      setApiData((prev) => {
        return { ...prev, hotelsArr: [...arr] };
      });
    }
    if (getSearchResultSort.rating.active) {
      const arr = apiData.hotelsArr;
      if (!arr) return;

      arr.sort(function (a, b) {
        return getSearchResultSort.rating.dir === 'asc' ? a.r - b.r : b.r - a.r;
      });

      setApiData((prev) => {
        return { ...prev, hotelsArr: [...arr] };
      });
    }
  }, [getSearchResultSort]);

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

    let url = `https://api.otpusk.com/api/2.6/tours/getResults?number=${number}&lang=${loc}&transport=${transport}&from=${up.value}&to=${down.value}&checkIn=${checkIn}&checkTo=${checkTo}&nights=${night.from}&nightsTo=${night.to}&people=${people}&access_token=337da-65e22-26745-a251f-77b9e`;
    if (applyFilter) {
      const { newData } = filterData;
      // const filters = newData.change;
      const filters = filterData.default.change;

      if (filters.includes(5) || filters.includes(4) || filters.includes(3)) {
        url += `&stars=${filters
          .filter((item) => item === 5 || item === 4 || item === 3)
          .join()}`;
      }

      // if (filters.includes('cost')) {
      if (newData.cost[0] !== undefined || newData.cost[1] !== undefined) {
        url += `&price=${newData.cost[0]}&priceTo=${newData.cost[1]}`;
      }

      if (
        filters.includes('ob') ||
        filters.includes('bb') ||
        filters.includes('hb') ||
        filters.includes('fb') ||
        filters.includes('ai') ||
        filters.includes('uai')
      ) {
        url += `&food=${filters
          .filter(
            (item) =>
              item === 'ob' ||
              item === 'bb' ||
              item === 'hb' ||
              item === 'fb' ||
              item === 'ai' ||
              item === 'uai'
          )
          .join()}`;
      }

      url += `&services=${filters
        .filter(
          (item) =>
            item !== 5 &&
            item !== 4 &&
            item !== 3 &&
            item !== 'cost' &&
            item !== 'ob' &&
            item !== 'bb' &&
            item !== 'hb' &&
            item !== 'fb' &&
            item !== 'ai' &&
            item !== 'uai'
        )
        .join()}`;

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
      setShow(false);
      console.log('start search');
      let data = await apiSearch(number);
      if (data) {
        console.log('res data', data);
        if (data.lastResult) {
          localStorage.setItem('result', JSON.stringify(data));
          setApiRes(data);
          ResultHandler(data);
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
  };

  useEffect(async () => {
    if (startSearch) {
      search();
    } else {
      // если флага startSearch нет, значит юзер ввел урл и тогда парсим параметры
      console.log('first visit');
      console.log(router.query);
      await parseUrl(router);
    }
  }, []);

  useEffect(() => {
    if (applyFilter) {
      search();
    }
  }, [applyFilter]);

  const add = () => {
    const { as, url } = window.history.state;
    // console.log('as', as);
    // console.log('url', url);
    const newAs = '/uk/search/';
    const newUrl = '/uk/search/';
    window.history.pushState(
      { ...window.history.state, as: newAs, url: newUrl },
      '',
      newAs
    );
  };

  if (error) {
    return <h4>Error</h4>;
  }

  return (
    <div style={filterData.btnTrigger ? { opacity: '.5' } : {}}>
      {isLoading && <Loader />}
      {show && apiRes.lastResult && (
        <MemoCards
          hotels={apiData.hotelsArr}
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
