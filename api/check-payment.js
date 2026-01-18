export const config = {
  runtime: "nodejs"
};

export default function handler(req, res) {
  try {
    res.status(200).json({
      ok: true,
      message: "API WORKS",
      env: {
        TONAPI_KEY: !!process.env.TONAPI_KEY,
        MY_WALLET: !!process.env.MY_WALLET
      }
    });
  } catch (e) {
    res.status(500).json({
      ok: false,
      error: e.message,
      stack: e.stack
    });
  }
}
