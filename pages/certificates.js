import styles from 'components/certificates/certificates.module.css';
import Form from 'components/certificates/form';
import { getPageSettings } from 'utils/fetch';
import SeoHead from '/components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { useIntl } from 'react-intl';
import changeImageUrl from 'utils/changeImageUrl';
import { useState, useEffect } from 'react';

const CostItems = ({ items, value, setValue }) => {
  const [itemsActive, setItemsActive] = useState(items.map(() => false));

  useEffect(() => {
    if (value === null) {
      setItemsActive(items.map(() => false));
    }
  }, [value]);

  const handlerClick = (value, ind) => {
    setItemsActive((prev) => {
      return [
        ...prev.map((_, index) => {
          return index === ind ? true : false;
        }),
      ];
    });
    setValue(value);
  };
  return items.map((item, ind) => {
    return (
      <div
        key={ind}
        className={`${styles.cost_item} ${
          itemsActive[ind] ? styles.active : ''
        }`}
        data-val={item.value}
        onClick={() => {
          handlerClick(item.value, ind);
        }}
      >
        {item.text}
      </div>
    );
  });
};

export default function Certificates({ mainPageSettings }) {
  const intl = useIntl();

  const [value, setValue] = useState(null);

  // console.log(mainPageSettings);
  const content_descr_text = changeImageUrl(
    mainPageSettings.translations[0].content_descr_text,
    'default'
  );
  const br_arr = [{ title: intl.formatMessage({ id: 'certificates.br' }) }];

  return (
    <>
      <SeoHead content={mainPageSettings} />
      <div className="container">
        <Breadcrumbs data={br_arr} beforeMainFrom />
        <div
          className={`${styles.title} block_title`}
          dangerouslySetInnerHTML={{
            __html: mainPageSettings.translations[0].h1,
          }}
        />
        <div className={styles.content_wrapper}>
          <div className={styles.content_text_block}>
            <div className={styles.content_img_wrapper}>
              <img src="/assets/img/certificates/wooman.png" alt="" />
            </div>
            <div className={styles.content_text}>
              <p className={styles.content_text_title}>
                {mainPageSettings.translations[0].content_descr}
              </p>
              <div
                className={styles.content_text_list}
                dangerouslySetInnerHTML={{
                  __html: content_descr_text,
                }}
              />
            </div>
          </div>

          <div className={styles.content_select_block}>
            <p className={styles.select_block_title}>
              {mainPageSettings.translations[0].select_title}
            </p>
            <div className={styles.cost_wrapper}>
              <CostItems
                items={mainPageSettings.cost}
                value={value}
                setValue={setValue}
              />
            </div>
            <Form costChecked={value} setCostChecked={setValue} />
          </div>
        </div>
        <p className={styles.term_title}>
          {mainPageSettings.translations[0].term_title}
        </p>
        <div
          className={styles.term_content}
          dangerouslySetInnerHTML={{
            __html: mainPageSettings.translations[0].term_content,
          }}
        />
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;

  const mainPageSettings = await getPageSettings('certificates_page', loc);

  if (mainPageSettings.errors) {
    // if incorrect request
    console.log('error: ', mainPageSettings?.errors);
    throw new Error('TEST ERROR');
  }

  return {
    props: {
      loc,
      mainPageSettings: mainPageSettings.data,
    },
    revalidate: 30,
  };
}
