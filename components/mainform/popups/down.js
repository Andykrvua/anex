import { useRef, useEffect, useState, memo } from 'react';
import dynamic from 'next/dynamic';
import useOutsideClick from '../../../utils/clickOutside';
import { allCountry } from '../../../utils/allCountry';
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
import { svgDown } from '../form-fields/svg';
import styles from './down.module.css';
import CountryList from 'components/countryList';
import { countryListVariants } from 'utils/constants';
import LoadingPlaceholder from '../form-fields/loadingPlaceholder';
import SimpleBar from 'simplebar-react';
import { transitionTime } from '../../../utils/constants';
import {
  useSetDown,
  useGetSearchCountryList,
  useSetSearchCountryList,
} from '../../../store/store';
import { FormattedMessage as FM, useIntl } from 'react-intl';
import useDebounce from 'utils/useDebounce';
import ItemCountry from './down-results/itemCountry';
import ItemCity from './down-results/itemCity';
import ItemHotel from './down-results/itemHotel';

const ResultItem = ({ data, clickHandler }) => {
  if (data.type === 'country')
    return <ItemCountry data={data} clickHandler={clickHandler} />;
  if (data.type === 'city')
    return <ItemCity data={data} clickHandler={clickHandler} />;
  if (data.type === 'hotel')
    return <ItemHotel data={data} clickHandler={clickHandler} />;
  return null;
};

// change scroll depending on mobile or desktop
const SimpleBarWrapper = ({ size, children }) => {
  return (
    <>
      {size.width >= maxWidth ? (
        <SimpleBar
          className="mobile_default"
          // style={{ maxHeight: 'var(--mainform-desktop-maxheight)' }}
          style={{ height: 'var(--mainform-desktop-maxheight)' }}
          autoHide={true}
        >
          {children}
        </SimpleBar>
      ) : (
        <>{children}</>
      )}
    </>
  );
};

// selected item confirmation block
const DownApplySelected = dynamic(
  () => import(/* webpackChunkName: "downApply" */ './downApplySelected'),
  {
    ssr: false,
    loading: () => {
      return <LoadingPlaceholder />;
    },
  }
);

const MemoCountryList = memo(CountryList);

export default function Down({
  setModalIsOpen,
  modalIsOpen,
  cName,
  popupName,
}) {
  const selectDown = useSetDown();
  const getSearchCountryList = useGetSearchCountryList();
  const setSearchCountryList = useSetSearchCountryList();

  const selectDownHandler = (val, id) => {
    selectDown({ name: val, value: id });
    setCountry(val);
    closeModalHandler();
    setTimeout(() => {
      setCountryData(false);
    }, transitionTime);
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

  const searchDelay = 500;
  const debouncedSearch = useDebounce(country, searchDelay);

  useEffect(async () => {
    console.log('g', getSearchCountryList);
    if (!getSearchCountryList.active) {
      const fetchMinCountryList = await fetch(
        'https://a-k.name/directus/items/country_minoffer?filter[status]=published'
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
    }
  }, []);

  useEffect(async () => {
    setSearchResult([]);
    if (country.length > 2) {
      setLoading(true);

      const search = await fetch(
        `/api/endpoints/suggests?text=${country}`
      ).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
      });

      console.log('result', search);
      if (search.ok) {
        setSearchResult(Object.entries(search.result.response));
      }
      setLoading(false);
    }
  }, [debouncedSearch]);
  // console.log('state', searchResult);
  // console.log('entri', Object.entries(searchResult));

  // get viewport height when opening momile keyboard
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {
        if (!window.visualViewport) return;
        window.visualViewport.addEventListener('resize', resizeHandler);
        return () =>
          window.visualViewport.removeEventListener('resize', resizeHandler);
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
    // console.log(e.target.value);
  };

  // const clickCountryItem = (val, id) => {
  //   console.log(val);
  //   console.log(id);
  //   // const selected = allCountry.find(
  //   //   (item) => item.code === e.target.closest('.country_item').dataset.code
  //   // );
  //   if (size.width >= maxWidth) {
  //     selectDownHandler(val);
  //   } else {
  //     setCountry(val);
  //     setCountryData(val);
  //   }
  // };

  const clickSearchResultItem = (val, id, img) => {
    console.log(val);
    console.log(id);

    if (size.width >= maxWidth) {
      selectDownHandler(val, id);
    } else {
      setCountry(val);
      setCountryData({ val, id, img });
    }
  };

  return (
    <SimpleBarWrapper size={size}>
      <div className="main_form_popup_mobile_wrapper" ref={wrapperRef}>
        <Header closeModalHandler={closeModalHandler} svg={svgDown} />
        <h3 className="title">{popupName}</h3>
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
                return (
                  <ResultItem
                    key={ind}
                    data={item[1]}
                    clickHandler={clickSearchResultItem}
                  />
                );
              })}
            </div>
          ) : null}
          {loading && (
            <div>
              <FM id="common.loading" />
            </div>
          )}
          {country.length < 3 ? (
            <>
              <h5 className={styles.down_content_title}>
                <FM id="mainform.down.t2" />
              </h5>
              <MemoCountryList
                variant={countryListVariants.getSearchPopular}
                clickSearchResultItem={clickSearchResultItem}
              />
              <h5 className={styles.down_content_title}>
                <FM id="mainform.down.t3" /> (31)
              </h5>
              <MemoCountryList
                variant={countryListVariants.getSearch}
                clickSearchResultItem={clickSearchResultItem}
              />
            </>
          ) : null}
        </div>
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
