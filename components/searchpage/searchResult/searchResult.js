// todo fetch hide token
import styles from './searchResult.module.css';
import { FormattedMessage as FM } from 'react-intl';
import Loader from 'components/common/loader';
import { useEffect, useState, memo, useRef } from 'react';
import {
  useGetUp,
  useGetDown,
  useSetDown,
  useSetUp,
  useGetDate,
  useGetNight,
  useSetNight,
  useGetPerson,
  useSetPerson,
  useGetUpPointList,
  useSetUpPointList,
  useSetSearchFilter,
  useGetSearchFilter,
  useGetStartSearch,
  useSetStartSearch,
  useSetSearchInProgress,
  useGetApplyFilter,
  useSetApplyFilter,
  useSetHotelService,
  useSetSearchResultSort,
  useSetDate,
  useGetSearchResultSort,
} from 'store/store';
import { useRouter } from 'next/router';
import parseUrl from '../pasteUrl/pasteUrl';
import Cards from './cards';
import { stringifyCrewComposition } from '../../../utils/customer-crew';

const MemoCards = memo(Cards);

export default function SearchResult({ isFilterBtnShow }) {
  // help data start
  const [step, setStep] = useState(10);
  const [helper, setHelper] = useState(false);
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
  const filterData = useGetSearchFilter();
  const startSearch = useGetStartSearch();
  const setStartSearch = useSetStartSearch();
  const setSearchInProgress = useSetSearchInProgress();
  const applyFilter = useGetApplyFilter();
  const setApplyFilter = useSetApplyFilter();
  const setHotelService = useSetHotelService();
  const setUp = useSetUp();
  const setNight = useSetNight();
  const setDate = useSetDate();
  const setPerson = useSetPerson();
  const getSearchResultSort = useGetSearchResultSort();
  const setSearchResultSort = useSetSearchResultSort();
  const setFilterData = useSetSearchFilter();

  const [error, setError] = useState(false);
  const [apiRes, setApiRes] = useState(false);
  const [apiData, setApiData] = useState(false);
  const [show, setShow] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countryHotelService, setCountryHotelService] = useState(false);
  const [searchParams, setSearchParams] = useState(false);
  const [page, setPage] = useState(1);

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

    apiData.hotelsArr.map((item) => {
      item.actualOffers.sort(function (a, b) {
        return a.pl - b.pl;
      });
    });

    setApiData(apiData);
    setSearchResultSort({
      price: {
        active: true,
        dir: 'asc',
      },
      rating: { active: false, dir: getSearchResultSort.rating.dir },
    });
  };

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
    const people = stringifyCrewComposition(person);

    const copiedDate = new Date(date.rawDate);
    copiedDate.setDate(copiedDate.getDate() + date.plusDays);

    const checkIn = date.rawDate.toISOString().substr(0, 10);
    const checkTo = copiedDate.toISOString().substr(0, 10);

    const transport = up.transport ? up.transport : 'no';

    let url = `https://api.otpusk.com/api/2.6/tours/getResults?page=${
      applyFilter ? 1 : page
    }&number=${number}&lang=${loc}&transport=${transport}&from=${up.value}&to=${
      down.value
    }&checkIn=${checkIn}&checkTo=${checkTo}&nights=${night.from}&nightsTo=${
      night.to
    }&people=${people}&access_token=337da-65e22-26745-a251f-77b9e`;

    const currentURL = window.location.href;
    const newURL = new URL(currentURL);

    url += `&price=${newURL.searchParams.get('price')}`;
    url += `&priceTo=${newURL.searchParams.get('priceTo')}`;
    url += `&stars=${newURL.searchParams.get('stars')}`;
    url += `&food=${newURL.searchParams.get('food')}`;
    url += `&services=${newURL.searchParams.get('services')}`;

    if (applyFilter) {
      setApplyFilter(false);
      setPage(1);
    }

    return url;
  }

  const search = async () => {
    setIsLoading(true);
    setSearchInProgress(true);
    setStartSearch(true);
    await fetch(
      `https://api.otpusk.com/api/2.6/tours/services?countryId=${down.countryValue ? down.countryValue : down.value}&lang=${loc}&access_token=337da-65e22-26745-a251f-77b9e`,
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
        /* eslint-disable-next-line */
        console.log('error', e);
        return null;
      });

    let number = 0;
    async function apiSearch(number) {
      const url = await getUrl(number);
      const res = await fetch(url)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .catch((e) => {
          setError(true);
          /* eslint-disable-next-line */
          console.log(e);
          setIsLoading(false);
          setSearchInProgress(false);
          return null;
        });

      return res;
    }

    async function recursiveFetch(number) {
      setApiRes(false);
      setShow(false);
      let data = await apiSearch(number);
      if (data) {
        if (data.lastResult) {
          setApiRes(data);
          ResultHandler(data);
          setShow(true);
          setIsLoading(false);
          setSearchInProgress(false);
        } else {
          if (number > 12) {
            if (data.total > 0) {
              setApiRes(data);
              ResultHandler(data);
              setShow(true);
              setIsLoading(false);
              setSearchInProgress(false);
              return;
            } else {
              setIsLoading(false);
              setSearchInProgress(false);
              setError(true);
              return;
            }
          }
          setTimeout(async () => {
            number++;
            await recursiveFetch(number);
          }, 5000);
        }
      } else {
        /* eslint-disable-next-line */
        console.log('ne data');
      }
    }
    await recursiveFetch(number);
  };

  useEffect(async () => {
    if (startSearch) {
      search();
      collectParams();
    } else {
      // если флага startSearch нет, значит юзер ввел урл и тогда парсим параметры
      setIsLoading(true);
      const res = await parseUrl(router, loc);

      if (!res) {
        setIsLoading(false);
        setError(true);
        return;
      }

      setDown({ ...res.to });
      setUp({ ...res.from });
      setNight({ from: res.nights, to: res.nightsTo });
      setDate({ ...res.date });
      setPerson({ ...res.people });
      setIsLoading(false);
      setHelper(true);
    }
  }, []);

  useEffect(() => {
    if (helper) {
      search();
      setHelper(false);
      collectParams();
    }
  }, [helper]);

  useEffect(() => {
    if (applyFilter) {
      search();
    }
  }, [applyFilter]);

  useEffect(() => {
    if (page !== 1) {
      search();
    }
  }, [page]);

  const collectParams = () => {
    const copiedDate = new Date(date.rawDate);
    copiedDate.setDate(copiedDate.getDate() + date.plusDays);

    let fromname;
    if (typeof up.name === 'string') {
      fromname = up.name;
    } else {
      fromname = up.name[router.locale];
    }

    const params = {
      transport: up.transport ? up.transport : 'no',
      from: up.value,
      fromname,
      to: down.value,
      checkIn: date.rawDate.toISOString().substr(0, 10),
      checkTo: copiedDate.toISOString().substr(0, 10),
      nights: night.from,
      nightsTo: night.to,
      people: stringifyCrewComposition(person),
    };

    setSearchParams(params);
  };

  const ref = useRef(0);

  const loadMore = () => {
    ref.current++;

    const clicks = Math.ceil(apiData.hotelsArr.length / 10);
    setStep((prev) => prev + 10);

    if (ref.current === clicks) {
      ref.current = 0;
      setPage((page) => page + 1);
      setStep(10);
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 500);
    }
  };

  if (error) {
    return <h4>Error</h4>;
  }

  return (
    <>
      <div style={isFilterBtnShow ? { opacity: '.5' } : {}}>
        {isLoading && <Loader />}
        {show && (
          <MemoCards
            hotels={apiData.hotelsArr}
            step={step}
            countryHotelService={countryHotelService?.icons || []}
            searchParams={searchParams}
          />
        )}
        {apiRes.total === 0 && (
          <div>
            <FM id="result.no_res" />
          </div>
        )}
      </div>
      {apiRes.total !== 0 && !isLoading && (
        <div className={styles.load_more_wrapper}>
          <button className={`${styles.load_more_btn} main_form_btn`} onClick={loadMore}>
            <svg width="28" height="25" viewBox="0 0 28 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M26.664 13.0321L24.0913 10.1667C23.9209 9.99479 23.6914 9.89844 23.4523 9.89844C23.2131 9.89844 22.9836 9.99479 22.8132 10.1667L20.2372 13.0321C20.1532 13.1173 20.0864 13.2187 20.0409 13.3305C19.9953 13.4423 19.9719 13.5623 19.9719 13.6834C19.9719 13.8046 19.9953 13.9245 20.0409 14.0363C20.0864 14.1482 20.1532 14.2496 20.2372 14.3348H22.3685C21.9699 15.8694 21.1828 17.2689 20.087 18.3919C18.9912 19.5149 17.6255 20.3216 16.1278 20.7304C14.3776 21.1995 12.5292 21.1083 10.8311 20.469C9.13296 19.8298 7.66662 18.6731 6.62922 17.1546L4.83228 18.4219C6.1267 20.3167 7.95646 21.7598 10.0754 22.5572C12.1943 23.3545 14.5008 23.4679 16.6845 22.882C18.6485 22.3485 20.4293 21.267 21.8289 19.758C23.2285 18.249 24.1919 16.3716 24.6118 14.3348H26.6624C26.7464 14.2496 26.813 14.1482 26.8586 14.0365C26.9042 13.9247 26.9277 13.8049 26.9279 13.6838C26.928 13.5627 26.9048 13.4428 26.8595 13.3309C26.8142 13.2191 26.7478 13.1175 26.664 13.0321Z"
                fill="#F8F9FA"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.01768 11.5354C8.10174 11.4502 8.16848 11.3488 8.21402 11.2369C8.25956 11.1251 8.28301 11.0052 8.28301 10.884C8.28301 10.7629 8.25956 10.6429 8.21402 10.5311C8.16848 10.4193 8.10174 10.3179 8.01768 10.2327H5.61792C6.02618 8.71749 6.81424 7.33813 7.90382 6.23156C8.99341 5.12499 10.3466 4.32974 11.829 3.92479C13.5793 3.45519 15.428 3.54652 17.126 4.18648C18.8241 4.82644 20.2899 5.98427 21.3259 7.50397L23.1245 6.23497C21.8297 4.3392 19.9993 2.8952 17.8794 2.09723C15.7596 1.29925 13.4521 1.18559 11.2673 1.77154C9.31853 2.30261 7.55 3.373 6.15551 4.86543C4.76101 6.35787 3.79435 8.21476 3.36145 10.2327H0.969919C0.885859 10.3179 0.819127 10.4193 0.773583 10.5311C0.72804 10.6429 0.70459 10.7629 0.70459 10.884C0.70459 11.0052 0.72804 11.1251 0.773583 11.2369C0.819127 11.3488 0.885859 11.4502 0.969919 11.5354L3.6678 14.2978C3.83819 14.4697 4.06773 14.5661 4.30686 14.5661C4.54599 14.5661 4.77553 14.4697 4.94592 14.2978L8.01768 11.5354Z"
                fill="#F8F9FA"
              />
            </svg>
            <FM id="result.load_more" />
          </button>
        </div>
      )}
    </>
  );
}
