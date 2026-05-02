import MainForm from '/components/mainform/mainForm.js';
import { useIntl } from 'react-intl';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import dynamic from 'next/dynamic';
import Loader from 'components/common/loader';

// dynamic(...) ОБОВ'ЯЗКОВО на module-level. Якщо описати всередині Search,
// при кожному ре-рендері створюється новий обгортковий тип → React unmount
// + mount Content → SearchResultV2 теряє session, ремаунт-ефекти знову
// тягнуть parseUrl + getResults + tours/services. Через це любий
// router.push({shallow:true}) (toggle filter, sort у URL) перестартовував
// поиск з нуля та обнуляв виданий список.
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
