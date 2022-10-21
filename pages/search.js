import MainForm from '/components/mainform/mainForm.js';
import { useIntl } from 'react-intl';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import {
  useGetUp,
  useGetDown,
  useGetDate,
  useGetNight,
  useGetPerson,
} from 'store/store';
import dynamic from 'next/dynamic';
import Loader from 'components/common/loader';
import { useRouter } from 'next/router';
import { memo, useEffect } from 'react';

export default function Search({ loc }) {
  console.log(loc);
  const intl = useIntl();
  const br_arr = [{ title: intl.formatMessage({ id: 'search.br' }) }];
  // const up = useGetUp();
  // const down = useGetDown();
  // const date = useGetDate();
  // const night = useGetNight();
  // const person = useGetPerson();

  const router = useRouter();
  // const loc = router.locale;
  console.log('rere');
  // useEffect(() => {
  //   router.push(
  //     {
  //       pathname: '/search',
  //       query: { sortBy: up.value },
  //     },
  //     undefined,
  //     { shallow: true }
  //   );
  // }, [up.value]);

  const Content = dynamic(
    () =>
      import(/* webpackChunkName: "result" */ 'components/searchpage/search'),
    {
      ssr: false,
      loading: () => {
        return <Loader />;
      },
    }
  );

  // const MemoContent = memo(Content);

  return (
    <>
      <div className="container">
        <div>
          {/* <div>{JSON.stringify(up)}</div>
          <div>{JSON.stringify(down)}</div>
          <div>{JSON.stringify(date)}</div>
          <div>{JSON.stringify(night)}</div>
          <div>{JSON.stringify(person)}</div> */}
        </div>
        <Breadcrumbs data={br_arr} beforeMainFrom />
        <MainForm />
        <Content />
      </div>
    </>
  );
}

// export async function getStaticProps(context) {
//   const loc = context.locale;

//   return {
//     props: {
//       loc,
//     },
//   };
// }
export async function getServerSideProps(context) {
  const loc = context.locale;
  console.log(context.query);

  return {
    props: {
      loc,
    },
  };
}
