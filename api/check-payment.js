export default async function handler(req, res) {
  try {
    const { address } = req.query;

    if (!address) {
      return res.status(400).json({ error: "No address provided" });
    }

    const response = await fetch(
      `https://tonapi.io/v2/accounts/${address}/transactions`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TONAPI_KEY}`
        }
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        error: "TONAPI request failed"
      });
    }

    const data = await response.json();
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
