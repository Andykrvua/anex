import { fetchTime, api_version } from 'utils/constants';

const request = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Bad response');
    })
    .catch((errors) => {
      return { errors };
    });
  return response;
};

const getMinOfferApi = async () => {
  const url = `${process.env.OPERATOR_API}${api_version}/tours/countries?with=price&data=minprice&lang=multi&access_token=${process.env.OPERATOR_ACCESS_TOKEN}`;

  const response = await fetch(url)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Bad response');
    })
    .catch((errors) => {
      return { errors };
    });

  if (response.errors || !response) {
    const data = null;
    return data;
  }

  const data = {};
  data.data = response;
  data.current = new Date();
  return data;
};

export default async function handler(req, res) {
  const url = `${process.env.API}${req.body.item}?fields=current`;
  const getCurrentTimestamp = await fetch(url)
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Bad response');
    })
    .catch((errors) => {
      return { errors };
    });

  if (getCurrentTimestamp.errors || !getCurrentTimestamp?.data?.current) return;

  const startDate = new Date(getCurrentTimestamp.data.current);
  const endDate = new Date();
  const seconds = Math.floor((endDate.getTime() - startDate.getTime()) / 1000);

  if (seconds < fetchTime.minOffer) {
    res.status(200).json({
      ok: 'еще не прошло 5 часов',
      seconds: `прошло ${seconds} секунд из 18 000`,
      fetchTime: fetchTime.minOffer,
    });
    return;
  } else {
    const data = await getMinOfferApi();

    if (!data) {
      res.status(200).json({
        ok: 'API down',
      });
      return;
    }

    const result = await request(
      `${process.env.API}${req.body.item}?access_token=${process.env.ACCESS_TOKEN}`,
      { ...data }
    );

    if (result.errors) {
      res.status(200).json({
        ok: false,
        result,
      });
      return;
    }

    res.status(200).json({
      ok: true,
      result,
      gg: 'request send',
      getCurrentTimestamp: getCurrentTimestamp.data.current,
      seconds: `прошло ${seconds} секунд`,
    });
  }
}
