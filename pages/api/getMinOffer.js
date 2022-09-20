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

export default async function handler(req, res) {
  async function getMinOfferApi() {
    const url =
      'https://api.otpusk.com/api/2.6/tours/countries?with=price&data=minprice&access_token=337da-65e22-26745-a251f-77b9e';

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

    if (response.errors) {
      console.log(response.errors);
    }

    const data = {};
    data.data = response;
    data.current = new Date().toISOString();
    return data;
  }

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

  let test = '';
  const startDate = new Date(getCurrentTimestamp.data.current);
  // Do your operations
  const endDate = new Date();
  const seconds = (endDate.getTime() - startDate.getTime()) / 1000;

  console.log('1 ', startDate.getTime() / 1000);
  console.log('2 ', Math.round(endDate.getTime() / 1000));
  console.log('3 ', startDate.toISOString());
  console.log('4 ', endDate.toISOString());

  // if (new Date(getCurrentTimestamp.data.current).getTime() < new Date().getTime()) {
  //   test = 'тeкущее время больше сохраненного';
  //   console.log('1 ', new Date(getCurrentTimestamp.data.current).getTime());
  //   console.log('2 ', Date.now());
  // } else {
  //   test = 'тeкущее время меньше сохраненного';
  //   console.log('3 ', new Date(getCurrentTimestamp.data.current).getTime());
  //   console.log('4 ', Date.now());
  // }

  const data = await getMinOfferApi();

  const result = await request(
    `${process.env.API}${req.body.item}?access_token=${process.env.ACCESS_TOKEN}`,
    { ...data }
  );
  console.log('my api res', result);

  if (result.errors) {
    res.status(200).json({
      ok: false,
      result,
    });
  }

  res.status(200).json({
    ok: true,
    result,
    time: new Date().toISOString(),
    ts: Date.now(result.data.current),
    getCurrentTimestamp: getCurrentTimestamp.data.current,
    test,
    seconds: `прошло ${seconds} секунд`,
  });
}
