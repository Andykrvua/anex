import { useRouter } from 'next/router';
import { countryListVariants } from '../utils/constants';
import styles from './countryList.module.css';
import { memo } from 'react';
import Link from 'next/link';
import { links } from 'utils/links';
import { carpathiansId, popCountryCode } from 'utils/constants';
import { useGetSearchCountryList } from '../store/store';

const List = ({ clickSearchResultItem, code = null, data = null, variant = null, setIsOpen = null }) => {
  const getSearchCountryList = useGetSearchCountryList();
  const { locale } = useRouter();
  const lang = 'name' + locale[0].toUpperCase() + locale.slice(1);
  const rawData = data ? data : getSearchCountryList.list;
  const countryData = variant === countryListVariants.getSearch
    ? [...rawData].sort((a, b) => (a[lang] || '').localeCompare(b[lang] || '', locale))
    : rawData;

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
    <div className={`${styles.all_country_wrapper} ${styles[variant]}`}>
      {countryData.map((item, i) => {
        if (code ? code.includes(item.code) : true && item.id !== carpathiansId) {
          return (
            <Item
              variant={variant}
              key={item.code}
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
          );
        }
      })}
    </div>
  );
};

const MemoList = memo(List);

export default function countryList({ variant, clickSearchResultItem, data, setIsOpen }) {
  switch (variant) {
    case countryListVariants.getSearch:
      return <MemoList data={data} clickSearchResultItem={clickSearchResultItem} variant={variant} />;

    case countryListVariants.getSearchPopular:
      return <MemoList data={data} clickSearchResultItem={clickSearchResultItem} code={popCountryCode} />;

    case countryListVariants.getNavMenu:
      return <MemoList data={data} variant={variant} setIsOpen={setIsOpen} />;

    default:
      /* eslint-disable-next-line */
      console.log('countryList component error');
      return null;
  }
}
