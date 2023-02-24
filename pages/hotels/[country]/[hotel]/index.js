import { useIntl } from 'react-intl';
import SeoHead from 'components/common/seoHead/seoHead.js';
import Breadcrumbs from 'components/common/breadcrumbs/breadcrumbs';

export default function Reviews({ data, hotel }) {
  const intl = useIntl();
  const br_arr = [{ title: intl.formatMessage({ id: 'reviews.br' }) }];

  return (
    <>
      <SeoHead content={null} />
      <div className="container">
        <Breadcrumbs data={br_arr} />
        <div>{data.country}</div>
        <div>{data.hotel}</div>
        {console.log(data)}
        {console.log(hotel)}
      </div>
    </>
  );
}

export async function getServerSideProps(ctx) {
  const data = ctx.query;

  function splitUrlString(str) {
    let separatorIndex = str.indexOf('-');
    if (separatorIndex === -1) {
      return [str];
    } else {
      let firstPart = str.slice(0, separatorIndex);
      let secondPart = str.slice(separatorIndex + 1);
      separatorIndex = secondPart.indexOf('-');
      if (separatorIndex === -1) {
        return [firstPart, secondPart];
      } else {
        let thirdPart = secondPart.slice(separatorIndex + 1);
        secondPart = secondPart.slice(0, separatorIndex);
        return [firstPart, secondPart, thirdPart];
      }
    }
  }

  const result = splitUrlString(data.hotel);
  const countryId = result[0];
  const hotelId = result[1];
  const hotelName = result[2];

  // const dev = process.env.NODE_ENV !== 'production';
  // const hostname = dev
  //   ? 'http://localhost:3000'
  //   : process.env.HOST;

  const hotel = await fetch(
    `http:localhost:3000/api/endpoints/hotels?hotelId=${hotelId}`
  ).then((response) => {
    if (response.status === 200) {
      if (response.ok) {
        return response.json();
      } else {
        return null;
      }
    }
    return null;
  });

  return { props: { data, hotel } };
}
