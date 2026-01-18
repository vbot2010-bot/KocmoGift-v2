module.exports = async (req, res) => {
  try {
    const address = req.query.address;

    if (!address) {
      res.status(400).json({ error: "No address provided" });
      return;
    }

    const response = await fetch(
      `https://tonapi.io/v2/accounts/${address}/transactions`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TONAPI_KEY}`
        }
      }
    );

    const text = await response.text();

    res.status(200).json({
      ok: true,
      tonapi_status: response.status,
      data: text
    });

  } catch (err) {
    res.status(500).json({
      ok: false,
      error: err.message,
      stack: err.stack
    });
  }
};
