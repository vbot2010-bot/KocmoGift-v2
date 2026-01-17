import fetch from "node-fetch";

const REDIS_URL = process.env.UPSTASH_REDIS_REST_URL;
const REDIS_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const TONAPI_KEY = process.env.TONAPI_KEY;
const MY_WALLET = process.env.MY_WALLET;

async function redisFetch(cmd, args) {
  const res = await fetch(REDIS_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${REDIS_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      commands: [[cmd, ...args]]
    })
  });

  const data = await res.json();
  return data;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { userId, txHash, amount } = req.body;

  if (!userId || !txHash || !amount) {
    return res.status(400).json({ error: "Missing params" });
  }

  // 1) проверяем, не использована ли tx
  const used = await redisFetch("GET", [`tx:${txHash}`]);
  if (used?.result && used.result[0]) {
    return res.status(400).json({ error: "Transaction already used" });
  }

  // 2) проверяем транзакцию через TonAPI
  const txRes = await fetch(`https://tonapi.io/v2/transactions/${txHash}`, {
    headers: { "X-API-KEY": TONAPI_KEY }
  });

  if (!txRes.ok) {
    return res.status(400).json({ error: "Transaction not found" });
  }

  const tx = await txRes.json();
  const incoming = tx.incoming_messages || [];

  const amountNano = Math.floor(amount * 1e9);

  const valid = incoming.some(msg =>
    msg.destination === MY_WALLET &&
    parseInt(msg.value) >= amountNano
  );

  if (!valid) {
    return res.status(400).json({ error: "Transaction not valid" });
  }

  // 3) начисляем баланс
  const balRes = await redisFetch("GET", [`bal:${userId}`]);
  let balance = balRes?.result?.[0] ? parseFloat(balRes.result[0]) : 0;

  balance += amount;

  await redisFetch("SET", [`bal:${userId}`, balance.toString()]);
  await redisFetch("SET", [`tx:${txHash}`, "1"]);

  return res.status(200).json({ balance });
                                 }
