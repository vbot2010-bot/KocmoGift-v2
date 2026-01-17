export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ ok: true });
  }

  const { userId, txHash, amount } = req.body;

  if (!userId || !txHash || !amount) {
    return res.status(400).json({ error: "Missing params" });
  }

  // Временная логика: просто возвращаем баланс равный сумме
  return res.status(200).json({ balance: amount });
}
