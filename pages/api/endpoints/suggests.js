export default async function handler(req, res) {
  const result = await fetch(
    `https://api.otpusk.com/api/2.6/tours/suggests?text=${req.query.text}&access_token=337da-65e22-26745-a251f-77b9e`
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
  }

  res.status(200).json({
    ok: true,
    result,
  });
}
