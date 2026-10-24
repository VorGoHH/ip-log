
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

const GEOIP_API = "https://geoip-api-jmsf.onrender.com";

const gif = Buffer.from(
  "R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
  "base64"
);

app.set("trust proxy", 1);

app.get("/image.gif", async (req, res) => {
  const cfIp = req.get("cf-connecting-ip");
  const forwardedFor = req.get("x-forwarded-for");

  const ip =
  cfIp ||
  forwardedFor?.split(",")[0].trim() ||
    req.socket.remoteAddress ||
    req.ip;

  const userAgent = req.get("user-agent") || "Unknown";

  console.log({
    event: "visitor_request",
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
  });

  // Запрос к GeoIP API для полученного IP
  try {
    const response = await fetch(
      `${GEOIP_API}/${encodeURIComponent(ip)}`,
                                 { signal: AbortSignal.timeout(10000) }
    );

    const result = await response.text();

    console.log({
      event: "geoip_result",
      requestedIp: ip,
      status: response.status,
      result,
    });
  } catch (error) {
    console.error("GeoIP API error:", error.message);
  }

  res.set({
    "Content-Type": "image/gif",
    "Cache-Control": "no-store, no-cache, must-revalidate",
  });

  res.send(gif);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
