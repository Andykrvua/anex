const request = async (url = '', data = {}) => {
  const response = await fetch(url, {
    method: 'POST',
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
  const result = await request(
    `${process.env.API}${req.body.item}?access_token=${process.env.ACCESS_TOKEN}`,
    { ...req.body }
  );

  if (result.errors) {
    res.status(200).json({
      ok: false,
    });
  }

  res.status(200).json({
    ok: true,
  });
}
