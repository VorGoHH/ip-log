
const express = require("express");

const app = express();
const PORT = process.env.PORT || 3000;

// Прозрачный GIF 1x1
const gif = Buffer.from(
  "R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=",
  "base64"
);

app.get("/image.gif", (req, res) => {
  const cfIp = req.get("cf-connecting-ip");
  const forwardedFor = req.get("x-forwarded-for");

  const ip =
    cfIp ||
    forwardedFor?.split(",")[0].trim() ||
    req.ip;

  const userAgent = req.get("user-agent") || "Unknown";

  console.log({
    ip,
    userAgent,
    timestamp: new Date().toISOString(),
    debug: {
      cfIp,
      forwardedFor,
      remoteAddress: req.socket.remoteAddress,
    },
  });

  res.set({
    "Content-Type": "image/gif",
    "Cache-Control": "no-store",
  });

  res.send(gif);
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
