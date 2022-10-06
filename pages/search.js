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

export default function Search({ loc }) {
  const intl = useIntl();
  const br_arr = [{ title: intl.formatMessage({ id: 'search.br' }) }];
  const up = useGetUp();
  const down = useGetDown();
  const date = useGetDate();
  const night = useGetNight();
  const person = useGetPerson();

  const Result = dynamic(
    () =>
      import(/* webpackChunkName: "result" */ 'components/searchpage/search'),
    {
      ssr: false,
      loading: () => {
        return <Loader />;
      },
    }
  );

  return (
    <>
      <div className="container">
        <div>
          <div>{JSON.stringify(up)}</div>
          <div>{JSON.stringify(down)}</div>
          <div>{JSON.stringify(date)}</div>
          <div>{JSON.stringify(night)}</div>
          <div>{JSON.stringify(person)}</div>
        </div>
        <Breadcrumbs data={br_arr} beforeMainFrom />
        <MainForm />
        <Result down={down} date={date} loc={loc} />
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const loc = context.locale;

  return {
    props: {
      loc,
    },
  };
}
