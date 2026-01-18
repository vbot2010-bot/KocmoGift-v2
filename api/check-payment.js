import fetch from "node-fetch";

export default async function handler(req, res) {
  const { address } = req.query;

  const r = await fetch(
    `https://tonapi.io/v2/accounts/${address}/transactions`,
    {
      headers: {
        Authorization: `Bearer ${process.env.TONAPI_KEY}`
      }
    }
  );

  const data = await r.json();
  res.json(data);
}
