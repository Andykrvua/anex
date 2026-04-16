import { useRef, useEffect, useState, memo } from 'react';
import dynamic from 'next/dynamic';
import useOutsideClick from '../../../utils/clickOutside';
import {
  useSetBodyScroll,
  getSize,
  enableScroll,
  clear,
  disableScroll,
  maxWidth,
  BODY,
} from '../../../utils/useBodyScroll';
import Header from './header';
import BackArrowSvg from 'components/common/backArrowSvg';
import { svgDown } from '../form-fields/svg';
import styles from './down.module.css';
import CountryList from 'components/countryList';
import { countryListVariants } from 'utils/constants';
import SimpleBar from 'simplebar-react';
import {
  useSetDown,
  useGetSearchCountryList,
  useSetSearchCountryList,
  useSetUpPointList,
  useSetToCities,
  useSetToCitiesNames,
} from '../../../store/store';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import useDebounce from 'utils/useDebounce';
import ItemCountry from './down-results/itemCountry';
import ItemCity from './down-results/itemCity';
import ItemHotel from './down-results/itemHotel';
import Loader from 'components/common/loader';
import { useRouter } from 'next/router';
import { languagesOperatorApi, transitionTime } from 'utils/constants';
import ResortView from './resortView';

const ResultItem = ({ data, clickHandler }) => {
  if (data.type === 'country') return <ItemCountry data={data} clickHandler={clickHandler} />;
  if (data.type === 'city') return <ItemCity data={data} clickHandler={clickHandler} />;
  if (data.type === 'hotel') return <ItemHotel data={data} clickHandler={clickHandler} />;
  return null;
};

// change scroll depending on mobile or desktop
const SimpleBarWrapper = ({ size, children }) => {
  return (
    <>
      {size.width >= maxWidth ? (
        <SimpleBar className="mobile_default main_form_open_scroll" autoHide={true}>
          {children}
        </SimpleBar>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

// selected item confirmation block
const DownApplySelected = dynamic(() => import(/* webpackChunkName: "downApply" */ './downApplySelected'), {
  ssr: false,
  loading: () => {
    return <Loader />;
  },
});

const MemoCountryList = memo(CountryList);

export default function Down({ setModalIsOpen, modalIsOpen, cName, popupName }) {
  const selectDown = useSetDown();
  const getSearchCountryList = useGetSearchCountryList();
  const setSearchCountryList = useSetSearchCountryList();
  const setUpPointList = useSetUpPointList();
  const setToCities = useSetToCities();
  const setToCitiesNames = useSetToCitiesNames();
  const { locale } = useRouter();
  const loc = languagesOperatorApi[locale];

  const selectDownHandler = (val, id, countryId = null, code) => {
    selectDown({ name: val, value: id, countryValue: countryId, code });
    setToCities([]);
    setToCitiesNames([]);
    // need fetch again up point list from new down point
    setUpPointList({
      active: false,
      list: [],
    });

    setCountry(val);
    closeModalHandler();
    setTimeout(() => {
      setCountryData(false);
    }, transitionTime);

    setModalIsOpen('btn_up');
  };

  const size = getSize();
  const wrapperRef = useRef(null);
  const scrollable = useRef(null);
  const input = useRef(null);
  const intl = useIntl();
  const placeholderTxt = intl.formatMessage({
    id: 'mainform.down.placeholder',
  });

  useOutsideClick(wrapperRef, setModalIsOpen, modalIsOpen, cName);
  useSetBodyScroll(modalIsOpen, maxWidth, size.width);

  const [iosView, setIosView] = useState(0);
  const [country, setCountry] = useState('');
  const [countryData, setCountryData] = useState({});
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resortCountry, setResortCountry] = useState(null);

  const searchDelay = 500;
  const debouncedSearch = useDebounce(country, searchDelay);

  useEffect(async () => {
    if (!getSearchCountryList.active) {
      setLoading(true);
      const fetchMinCountryList = await fetch(
        `${process.env.NEXT_PUBLIC_API}country_minoffer?filter[status]=published`
      ).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      });

      if (fetchMinCountryList) {
        setSearchCountryList({
          active: true,
          list: fetchMinCountryList.data.data.countries,
        });
      }
      setLoading(false);
    }
  }, []);

  useEffect(async () => {
    setSearchResult([]);
    if (country.length > 2) {
      setLoading(true);

      const search = await fetch(`/api/endpoints/suggests?text=${country}&loc=${loc}`).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      });

      if (search.ok) {
        setSearchResult(Object.entries(search.result.response));
      }
      setLoading(false);
    }
  }, [debouncedSearch]);

  // get viewport height when opening momile keyboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        if (!window.visualViewport) return;
        window.visualViewport.addEventListener('resize', resizeHandler);
        return () => window.visualViewport.removeEventListener('resize', resizeHandler);
      }
    }
  }, []);

  function resizeHandler() {
    // ios 13+ get height when keyboard is open
    // need fix for ios > 13
    setIosView(window.visualViewport.height);
  }

  useEffect(() => {
    if (size.width < maxWidth) {
      if (modalIsOpen) {
        disableScroll(scrollable.current);
      }
    }
    return () => {
      clear();
    };
  }, [modalIsOpen, size.width]);

  const closeModalHandler = () => {
    if (size.width < maxWidth) {
      enableScroll(BODY);
    }
    setModalIsOpen('');
  };

  const inputOnchange = (e) => {
    setCountry(e.target.value);
  };

  const clickSearchResultItem = (val, id, countryId, img, code) => {
    if (size.width >= maxWidth) {
      selectDownHandler(val, id, countryId, code);
    } else {
      setCountry(val);
      setCountryData({ val, id, countryId, img, code });
    }
  };

  const lang = 'name' + locale[0].toUpperCase() + locale.slice(1);

  const handleResortClick = (item) => {
    setResortCountry({
      id: item.id,
      name: item[lang] || item.name,
      code: item.code,
      img: {
        src: `/assets/img/svg/flags/code/${item.code}.svg`,
      },
    });
  };

  const handleResortBack = () => {
    setResortCountry(null);
  };

  const handleResortApply = (selectedIds, resortCountryData, resortNames) => {
    if (selectedIds.length === 0) return;

    const countryId = resortCountryData.id;
    const countryName = resortCountryData.name;
    const countryCode = resortCountryData.code;

    if (selectedIds.length === 1) {
      setToCities([]);
      setToCitiesNames([]);
      selectDown({
        name: { ru: resortNames[0], uk: resortNames[0] },
        value: selectedIds[0],
        countryValue: countryId,
        code: {
          district: true,
          hotel: false,
          img: `/assets/img/svg/flags/code/${countryCode}.svg`,
        },
      });
    } else {
      setToCities(selectedIds);
      setToCitiesNames(resortNames);
      selectDown({
        name: { ru: countryName, uk: countryName },
        value: countryId,
        countryValue: countryId,
        code: {
          district: false,
          hotel: false,
          img: `/assets/img/svg/flags/code/${countryCode}.svg`,
        },
      });
    }

    setUpPointList({ active: false, list: [] });
    setResortCountry(null);
    closeModalHandler();
  };

  return (
    <SimpleBarWrapper size={size}>
      <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
        <Header closeModalHandler={closeModalHandler} onBack={resortCountry ? handleResortBack : null} svg={svgDown} />
        <h3 className="title">
          {resortCountry && (
            <button
              className={`${styles.resort_back_btn} svg_btn`}
              onClick={handleResortBack}
              type="button"
              aria-label="Back"
            >
              <BackArrowSvg />
            </button>
          )}
          {resortCountry ? resortCountry.name : popupName}
        </h3>

        {resortCountry ? (
          <div
            className="popup_scrollable_content"
            ref={scrollable}
            style={
              iosView
                ? { flex: `0 0 ${iosView - 243}px` }
                : {}
            }
          >
            <ResortView
              country={resortCountry}
              loc={loc}
              onApply={handleResortApply}
            />
          </div>
        ) : (
          <>
            <div className={styles.down_input_wrapper}>
              <input
                ref={input}
                type="text"
                name=""
                id=""
                placeholder={placeholderTxt}
                onChange={(e) => inputOnchange(e)}
                value={country}
              />
            </div>
            <div
              className="popup_scrollable_content"
              ref={scrollable}
              style={
                iosView
                  ? {
                      flex: `0 0 ${iosView - 243}px`,
                    }
                  : {}
              }
            >
              {searchResult.length > 0 ? (
                <div style={{ marginBottom: '30px' }}>
                  {searchResult.map((item, ind) => {
                    return <ResultItem key={ind} data={item[1]} clickHandler={clickSearchResultItem} />;
                  })}
                </div>
              ) : null}
              {loading && <Loader />}
              {country.length < 3 ? (
                <>
                  {!loading && (
                    <>
                      <div className={styles.down_titles_row}>
                        <h5 className={styles.down_content_title}>
                          <FM id="mainform.down.t2" />
                        </h5>
                        <h5 className={styles.down_content_title}>
                          <FM id="mainform.down.resorts" />
                        </h5>
                      </div>

                      <MemoCountryList
                        variant={countryListVariants.getSearchPopular}
                        clickSearchResultItem={clickSearchResultItem}
                        onResortClick={handleResortClick}
                      />
                      <div className={styles.down_titles_row}>
                        <h5 className={styles.down_content_title}>
                          <FM id="mainform.down.t3" /> (31)
                        </h5>
                        <h5 className={styles.down_content_title}>
                          <FM id="mainform.down.resorts" />
                        </h5>
                      </div>
                      <MemoCountryList
                        variant={countryListVariants.getSearch}
                        clickSearchResultItem={clickSearchResultItem}
                        onResortClick={handleResortClick}
                      />
                    </>
                  )}
                </>
              ) : null}
            </div>
          </>
        )}
        {countryData?.id && (
          <DownApplySelected
            item={countryData}
            setCountryData={setCountryData}
            selectDownHandler={selectDownHandler}
          />
        )}
      </div>
    </SimpleBarWrapper>
  );
}
