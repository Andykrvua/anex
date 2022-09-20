export default async function handler(req, res) {
  const date = new Date().toISOString();
  // new Date().toLocaleString('uk')

  res.status(200).json({
    date,
  });
}
