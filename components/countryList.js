import { allCountry } from 'utils/allCountry';
import { countryListVariants } from '../utils/constants';
import styles from './countryList.module.css';
import { memo } from 'react';
import Link from 'next/link';
import { links } from '/utils/links';

const List = ({
  clickCountryItem,
  limit = 100,
  data = null,
  variant = null,
  setIsOpen = null,
}) => {
  const countryData = data ? data : allCountry;

  const Item = ({ children, code, slug, variant }) => {
    return variant === countryListVariants.getNavMenu ? (
      <Link href={`${links.countries}/${slug}`}>
        <a
          className={`${styles.country_item} country_item touch`}
          onClick={() => setIsOpen(false)}
        >
          {children}
        </a>
      </Link>
    ) : (
      <div
        variant={variant}
        className={`${styles.country_item} country_item`}
        onClick={(e) => clickCountryItem(e)}
        data-code={code}
      >
        {children}
      </div>
    );
  };

  return (
    <div className={`${styles.all_country_wrapper} ${styles[variant]}`}>
      {countryData.map((item, i) => {
        if (i < limit) {
          return (
            <Item
              variant={variant}
              key={item.code}
              onClick={(e) => clickCountryItem(e)}
              data-code={item.code}
              code={item.code}
              slug={item?.slug}
            >
              <div className={styles.country_item_img}>
                <img
                  src={`/assets/img/svg/flags/${item.code}.svg`}
                  alt={item.name}
                  width="60"
                  height="43"
                />
              </div>
              <div className={styles.country_item_name}>
                {item.translations[0].name}
              </div>
              <div className={styles.country_item_price}>
                {item.price ? item.price : '12 022'}
              </div>
            </Item>
          );
        }
      })}
    </div>
  );
};

const MemoList = memo(List);

export default function countryList({
  variant,
  clickCountryItem,
  data,
  setIsOpen,
}) {
  switch (variant) {
    case countryListVariants.getSearch:
      return <MemoList clickCountryItem={clickCountryItem} />;

    case countryListVariants.getSearchPopular:
      return <MemoList clickCountryItem={clickCountryItem} limit={8} />;

    case countryListVariants.getNavMenu:
      return <MemoList data={data} variant={variant} setIsOpen={setIsOpen} />;

    default:
      /* eslint-disable-next-line */
      console.log('countryList component error');
      return null;
  }
}
