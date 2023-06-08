import { api_version } from 'utils/constants';

export default async function handler(req, res) {
  const result = await fetch(
    `${process.env.OPERATOR_API}${api_version}/tours/countries?lang=${req.query.locale}&access_token=${process.env.OPERATOR_ACCESS_TOKEN}`
  )
    .then((response) => {
      if (response.status === 200) {
        return response.json();
      }
      throw new Error('Bad response');
    })
    .catch((errors) => {
      return { errors };
    });

  if (result.errors) {
    res.status(200).json({
      ok: false,
    });
    return;
  }

  res.status(200).json({
    ok: true,
    result,
  });
}
