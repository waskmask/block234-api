const mongoose = require("mongoose");

const coinSchema = new mongoose.Schema({
  id: String,
  symbol: String,
  name: String,
  image: String,
  current_price: Number,
  price_change_percentage_24h: Number,
  market_cap: Number, // ⬅ Added market cap
  volume_24h: Number, // ⬅ Added 24-hour trading volume
  updated_at: { type: Date, default: Date.now },
});

const Coin = mongoose.model("Coin", coinSchema);
module.exports = Coin;
