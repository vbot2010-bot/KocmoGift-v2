export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  const { userId, txHash, amount } = req.body;

  if (!userId || !txHash || !amount) {
    return res.status(400).json({ error: "Missing params" });
  }

  // Здесь просто возвращаем баланс = amount (для теста)
  return res.status(200).json({ balance: amount });
}
