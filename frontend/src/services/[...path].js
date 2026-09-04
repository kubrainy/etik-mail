export default async function handler(req, res) {
  const target = process.env.BACKEND_URL;   
  const key = process.env.BACKEND_KEY;   

  const path = req.url.replace(/^\/api/, "");

  try {
    const upstream = await fetch(target + path, {
      method: req.method,
      headers: {
        "Content-Type": "application/json",
        ...(key ? { "x-api-key": key } : {}),
      },
      body: ["GET", "HEAD"].includes(req.method)
        ? undefined
        : JSON.stringify(req.body ?? {}),
    });

    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", "application/json");
    res.send(text);
  } catch (err) {
    res.status(502).json({ detail: "Backend'e ulaşılamadı." });
  }
}
