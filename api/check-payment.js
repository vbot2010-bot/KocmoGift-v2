export const config = {
  runtime: "nodejs"
};

export default async function handler(req, res) {
  try {
    res.status(200).json({
      ok: true,
      message: "API WORKS",
      env: !!process.env.TONAPI_KEY
    });
  } catch (e) {
    res.status(500).json({
      error: e.message
    });
  }
}
