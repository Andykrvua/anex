import { useIntl } from 'react-intl';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';
import ReviewsHeader from 'components/reviews/header';
import ReviewsContent from 'components/reviews/content';
import { SessionProvider } from 'next-auth/react';
import Auth from 'components/reviews/auth';
import { reviewsPerPage } from '/utils/constants';
import { getReviews } from '/utils/fetch';

export default function Reviews({ data }) {
  const intl = useIntl();
  const br_arr = [{ title: intl.formatMessage({ id: 'reviews.br' }) }];

  return (
    <>
      <SeoHead content={null} />
      <div className="container">
        <Breadcrumbs data={br_arr} />
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const data = ctx.query;

  // const country = await fetch(
  //   'https://api.otpusk.com/api/2.6/tours/countries?lang=ua&access_token=337da-65e22-26745-a251f-77b9e'
  // );
  // const cres = await country.json();

  return { props: { data } };
}
