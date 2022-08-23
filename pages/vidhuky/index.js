import { useIntl } from 'react-intl';
import Head from 'next/head';
import { links } from 'utils/links';
import { blogApi } from 'utils/constants';
import BlogContent from 'components/blog/blog';
import { getPostsList, getCategories, getCountries } from 'utils/fetch';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import Pagination from 'components/blog/pagination';
import ReviewHeader from 'components/reviews/header';
import ReviewsContent from 'components/reviews/content';
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Reviews({ data }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';
  console.log(session);
  const handleSignin = (e) => {
    e.preventDefault();
    signIn();
  };
  const handleSignout = (e) => {
    e.preventDefault();
    signOut();
  };
  const intl = useIntl();
  console.log(data);

  const br_arr = [{ title: intl.formatMessage({ id: 'reviews.br' }) }];

  const pagesCount = Math.ceil(data?.meta.filter_count / 3);

  // const current = 1;

  return (
    <>
      <SeoHead content={null} />
      <div className="container">
        <Breadcrumbs data={br_arr} />
        {session && (
          <a href="#" onClick={handleSignout} className="btn-signin">
            Sign out
          </a>
        )}
        {!session && (
          <a href="#" onClick={handleSignin} className="btn-signin">
            Sign in
          </a>
        )}
        {loading && <div>Loading...</div>}
        {session && (
          <>
            <p style={{ marginBottom: '10px' }}>
              Welcome, {session.user.name ?? session.user.email}
            </p>
            <br />
            <img
              src={session.user.image}
              alt=""
              style={{ height: '26px', width: '26px' }}
              referrerPolicy="no-referrer"
            />
          </>
        )}
        {!session && (
          <>
            <p>Please Sign in</p>
          </>
        )}
        <ReviewHeader />
        <ReviewsContent data={data.data} />
        <Pagination
          curr={1}
          pagesCount={pagesCount}
          firstPageUrl={'/vidhuky'}
        />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  const res = await fetch(
    `https://a-k.name/directus/items/reviews?meta=*&page=1&limit=3&sort=sort,-date&filter[status]=published`
  );
  const data = await res.json();

  // Pass data to the page via props
  return { props: { data } };
}
