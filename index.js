const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

app.get("/", (req, res) => {
  res.json({
    message: "BTC API ist aktiv",
    endpoints: {
      candles: "/candles",
    },
  });
});

app.get("/candles", async (req, res) => {
  try {
    const response = await axios.get("https://api.binance.com/api/v3/klines", {
      params: {
        symbol: "BTCUSDT",
        interval: "1m",
        limit: 50,
      },
    });

    const candles = response.data.map((c) => ({
      time: c[0],
      o: parseFloat(c[1]),
      h: parseFloat(c[2]),
      l: parseFloat(c[3]),
      c: parseFloat(c[4]),
    }));

    res.json(candles);
  } catch (err) {
    res.status(500).json({ error: "Fehler beim Abrufen der Candle-Daten." });
  }
});

app.listen(PORT, () => {
  console.log(`BTC-API läuft auf Port ${PORT}`);
});
