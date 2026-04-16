import { useRouter } from 'next/router';
import { countryListVariants } from '../utils/constants';
import styles from './countryList.module.css';
import { memo } from 'react';
import Link from 'next/link';
import { links } from 'utils/links';
import { carpathiansId, popCountryCode } from 'utils/constants';
import { useGetSearchCountryList } from '../store/store';

const ResortButton = ({ onClick }) => (
  <button
    className={styles.resort_btn}
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    type="button"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 1C5.24 1 3 3.24 3 6C3 9.75 8 15 8 15C8 15 13 9.75 13 6C13 3.24 10.76 1 8 1ZM8 7.75C7.04 7.75 6.25 6.96 6.25 6C6.25 5.04 7.04 4.25 8 4.25C8.96 4.25 9.75 5.04 9.75 6C9.75 6.96 8.96 7.75 8 7.75Z"
        fill="currentColor"
      />
    </svg>
  </button>
);

const List = ({ clickSearchResultItem, code = null, data = null, variant = null, setIsOpen = null, onResortClick = null }) => {
  const getSearchCountryList = useGetSearchCountryList();
  const { locale } = useRouter();
  const lang = 'name' + locale[0].toUpperCase() + locale.slice(1);
  const rawData = data ? data : getSearchCountryList.list;
  const countryData = variant === countryListVariants.getSearch
    ? [...rawData].sort((a, b) => (a[lang] || '').localeCompare(b[lang] || '', locale))
    : rawData;

  const isSearchVariant = variant === countryListVariants.getSearch || variant === countryListVariants.getSearchPopular || !variant;

  const Item = ({ children, slug, variant, values }) => {
    return variant === countryListVariants.getNavMenu ? (
      <Link href={`${links.countries}/${slug}`}>
        <a className={`${styles.country_item} country_item touch`} onClick={() => setIsOpen(false)}>
          {children}
        </a>
      </Link>
    ) : (
      <div
        variant={variant}
        className={`${styles.country_item} country_item`}
        onClick={() =>
          clickSearchResultItem(values.val, values.id, values.countryId, values.img, values.code)
        }
      >
        {children}
      </div>
    );
  };

  return (
    <div className={`${styles.all_country_wrapper} ${styles[variant]} ${isSearchVariant && onResortClick ? styles.single_column : ''}`}>
      {countryData.map((item, i) => {
        if (code ? code.includes(item.code) : true && item.id !== carpathiansId) {
          return (
            <div className={isSearchVariant && onResortClick ? styles.country_row : ''} key={item.code}>
              <Item
                variant={variant}
                slug={item?.slug}
                values={{
                  val: item[lang],
                  id: item.id,
                  countryId: item.id,
                  img: { src: `/assets/img/svg/flags/code/${item.code}.svg` },
                  code: {
                    district: false,
                    hotel: false,
                    img: `/assets/img/svg/flags/code/${item.code}.svg`,
                  },
                }}
              >
                <div className={styles.country_item_img}>
                  <img
                    src={
                      variant === countryListVariants.getNavMenu
                        ? `/assets/img/svg/flags/${item.code}.svg`
                        : `/assets/img/svg/flags/code/${item.code}.svg`
                    }
                    alt={item.name}
                    width="60"
                    height="43"
                  />
                </div>
                <div className={styles.country_item_name}>
                  {variant === countryListVariants.getNavMenu ? item.translations[0].name : item[lang]}
                </div>
                <div className={styles.country_item_price}>{item.uah ? item.uah.toLocaleString() : null}</div>
              </Item>
              {isSearchVariant && onResortClick && (
                <ResortButton onClick={() => onResortClick(item)} />
              )}
            </div>
          );
        }
      })}
    </div>
  );
};

const MemoList = memo(List);

export default function countryList({ variant, clickSearchResultItem, data, setIsOpen, onResortClick }) {
  switch (variant) {
    case countryListVariants.getSearch:
      return <MemoList data={data} clickSearchResultItem={clickSearchResultItem} variant={variant} onResortClick={onResortClick} />;

    case countryListVariants.getSearchPopular:
      return <MemoList data={data} clickSearchResultItem={clickSearchResultItem} code={popCountryCode} onResortClick={onResortClick} />;

    case countryListVariants.getNavMenu:
      return <MemoList data={data} variant={variant} setIsOpen={setIsOpen} />;

    default:
      /* eslint-disable-next-line */
      console.log('countryList component error');
      return null;
  }
}
