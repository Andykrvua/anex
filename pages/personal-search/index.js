import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import { languagesOperatorApi } from 'utils/constants';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Loader from 'components/common/loader';

export default function Hotel({ data, hotel }) {
  const br_arr = [{ title: hotel?.n }];
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(async () => {
    setIsLoading(true);
    let fragmentParams = window.location.hash.split('!')[1];

    const urlParams = new URLSearchParams(fragmentParams);
    const d = urlParams.get('d');
    const i = urlParams.get('i');
    const c = urlParams.get('c');
    const v = urlParams.get('v');
    const od = urlParams.get('od');
    const l = urlParams.get('l');
    const ol = urlParams.get('ol');
    const p = urlParams.get('p');
    const w = urlParams.get('w');
    const ex = urlParams.get('ex');
    const page = urlParams.get('page');
    const hid = urlParams.get('hid');
    const hnm = urlParams.get('hnm');
    const oid = urlParams.get('oid');
    const tr = urlParams.get('tr');

    if (i) {
      const loc = languagesOperatorApi[router.locale];

      const getCountries = await fetch(
        `/api/endpoints/countries?locale=${loc}`
      ).then((response) => {
        if (response.status === 200) {
          return response.json();
        }
        return null;
      });

      if (getCountries?.ok) {
        const country = getCountries.result.countries.filter(
          (item) => item.id === Number(i)
        );

        const from = await fetch(
          `/api/endpoints/fromcities?geoId=${i}&locale=${loc}`
        ).then((response) => {
          if (response.status === 200) {
            return response.json();
          }
          return null;
        });

        let fromCity = '';
        if (from?.ok) {
          const test = from.result.fromCities.filter(
            (item) => item.id === Number(d)
          );

          if (test.length) {
            fromCity = test[0].name;
          }
        }

        const link = `${router.locale === 'uk' ? '/uk' : ''}/hotels/${
          country[0]?.code
        }/${i}-${hid}-${hnm}?offer=${oid}&transport=${tr}&from=${d}&fromname=${fromCity}&to=${i}&checkIn=${c}&checkTo=${v}&nights=${l}&nightsTo=${ol}&people=${p}`;

        if (country.length) {
          handleRedirect(link);
        }
      }
    }

    return () => {
      setIsLoading(false);
    };
  }, []);

  const handleRedirect = (link) => {
    router.push(link);
  };

  return (
    <>
      <SeoHead content={null} />
      <div className="container">
        <Breadcrumbs data={br_arr} />
        {isLoading && <Loader />}
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const data = ctx.query;
  const loc = languagesOperatorApi[ctx.locale];

  return {
    props: {
      data,
      hotel: null,
    },
  };
}
