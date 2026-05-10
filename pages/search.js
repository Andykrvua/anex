import MainForm from '/components/mainform/mainForm.js';
import { useIntl } from 'react-intl';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import dynamic from 'next/dynamic';
import Loader from 'components/common/loader';

// dynamic(...) MUST be at module-level. If defined inside Search,
// a new wrapper type is created on every re-render → React unmount
// + mount Content → SearchResultV2 loses its session, mount effects re-run
// parseUrl + getResults + tours/services. Because of this, any
// router.push({shallow:true}) (toggle filter, sort in URL) would restart
// the search from scratch and reset the result list.
const Content = dynamic(
  () => import(/* webpackChunkName: "result" */ 'components/searchpage/search'),
  {
    ssr: false,
    loading: () => <Loader />,
  },
);

export default function Search() {
  const intl = useIntl();
  const br_arr = [{ title: intl.formatMessage({ id: 'search.br' }) }];

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

  return {
    props: {
      loc,
    },
  };
}
