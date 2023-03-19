import { api_version } from 'utils/constants';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(200).json({
      ok: false,
    });
    return;
  }

  console.log('req', req.body);
  const { from, to, people, checkIn, checkTo, nights, nightsTo, transport } =
    req.body;

  const search = async () => {
    let number = 0;
    async function apiSearch(number) {
      const url = `${process.env.OPERATOR_API}${api_version}/tours/getResults?number=${number}&transport=${transport}&from=${from}&to=${to}&checkIn=${checkIn}&checkTo=${checkTo}&nights=${nights}&nightsTo=${nightsTo}&people=${people}&access_token=${process.env.OPERATOR_ACCESS_TOKEN}`;
      const res = await fetch(url)
        .then((response) => {
          if (response.status === 200) {
            return response.json();
          }
        })
        .catch((e) => {
          console.log(e);
          return null;
        });

      return res;
    }

    async function recursiveFetch(number) {
      let data = await apiSearch(number);
      if (data) {
        if (data.lastResult) {
          res.status(200).json({
            ok: true,
            data,
          });
          return data;
        } else {
          if (number > 12) {
            res.status(200).json({
              ok: false,
            });
            return null;
          }
          setTimeout(async () => {
            number++;
            await recursiveFetch(number);
          }, 5000);
        }
      } else {
        console.log('bad res');
        return null;
      }
    }

    await recursiveFetch(number);
  };
  search();
}
