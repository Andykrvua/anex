import styles from 'components/contacts/contacts.module.css';
import Form from 'components/contacts/form';
import { getPageSettings } from 'utils/fetch';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { useIntl } from 'react-intl';
import { useRef, useState, useEffect } from 'react';

const useIntersectionObserver = (ref, setIsShow, options) => {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting) {
        setIsShow(true);
        observer.unobserve(entry.target);
      }
    }, options);

    if (ref.current) {
      observer.observe(ref.current);
    }
  }, []);

  return isIntersecting;
};

export default function Contacts({ pageSettings }) {
  const intl = useIntl();
  const [isShow, setIsShow] = useState(false);
  const gmap = useRef();
  useIntersectionObserver(gmap, setIsShow, { threshold: 0.5 });

  const br_arr = [{ title: intl.formatMessage({ id: 'contacts.br' }) }];

  return (
    <>
      <SeoHead content={pageSettings} />
      <div className="container">
        <Breadcrumbs data={br_arr} beforeMainFrom />
        <div className={styles.contacts_wrapper}>
          <div className={styles.contacts_content}>
            <h1 className={styles.title}>{pageSettings.translations[0].h1}</h1>
            <div className={styles.phones}>
              {pageSettings.phone_numbers.map((item, index) => (
                <a key={index} className={styles.phone} href={`tel:${item.phone_number}`}>
                  {item.phone_text}
                </a>
              ))}
              <a href={`mailto:${pageSettings.email}`}>{pageSettings.email}</a>
            </div>
            <h3 className={styles.subtitle}>{pageSettings.translations[0].schedule_title}</h3>
            <div
              className={styles.subtitle_content}
              dangerouslySetInnerHTML={{
                __html: pageSettings.translations[0].schedule_content,
              }}
            />
            <h3 className={styles.subtitle} style={{ opacity: 0 }}>
              {pageSettings.translations[0].address_title}
            </h3>
            <div
              className={styles.subtitle_content}
              style={{ opacity: 0 }}
              dangerouslySetInnerHTML={{
                __html: pageSettings.translations[0].address_content,
              }}
            />
          </div>
          <div className={styles.gmap_wrapper} ref={gmap}>
            {isShow ? (
              <iframe
                src={pageSettings.gmap_link}
                title="ANEX Tour"
                style={{ width: '100%' }}
                height="480"
              ></iframe>
            ) : (
              <a href={pageSettings.gmap_link} title="ANEX Tour"></a>
            )}
          </div>
          <div className={styles.contacts_form}>
            <h2 className={styles.form_title}>{pageSettings.translations[0].form_title}</h2>
            <Form />
          </div>
        </div>
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;

  const data =
    'translations.h1,translations.schedule_title,translations.schedule_content,translations.address_title,translations.address_content,translations.form_title';
  const pageSettings = await getPageSettings('contacts_page', loc, data);

  if (pageSettings.errors) {
    // if incorrect request
    /* eslint-disable-next-line */
    console.log('error: ', pageSettings?.errors);
    throw new Error('ERROR CONTACTS');
  }

  return {
    props: {
      loc,
      pageSettings: pageSettings.data,
    },
    revalidate: 30,
  };
}
