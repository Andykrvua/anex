import { api_version } from 'utils/constants';

export default async function handler(req, res) {
  const { lat, lon, countryId, cityId, lang } = req.query;

  const params = new URLSearchParams({
    data: 'minOffer',
    geo: `${lat},${lon}`,
    rad: 6,
    with: 'price',
    lang: lang || '',
    access_token: process.env.OPERATOR_ACCESS_TOKEN,
  });

  if (countryId) params.set('countryId', countryId);
  if (cityId) params.set('cityId', cityId);

  console.log('params', params);
  const result = await fetch(`${process.env.OPERATOR_API}${api_version}/tours/hotels?${params}`)
    .then((response) => {
      if (response.status === 200) return response.json();
      throw new Error('Bad response');
    })
    .catch(() => ({ errors: true }));
  console.log('result', result);

  if (result.errors) {
    return res.status(200).json({ ok: false, hotels: [] });
  }

  res.status(200).json({ ok: true, hotels: result.hotels || [] });
}
