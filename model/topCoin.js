const mongoose = require("mongoose");

const topCoinSchema = new mongoose.Schema({
  id: String,
  symbol: String,
  name: String,
  image: String,
  current_price: Number,
  price_change_percentage_24h: Number,
  updated_at: { type: Date, default: Date.now },
});

const TopCoin = mongoose.model("TopCoin", topCoinSchema); // ⬅ Capitalized model name
module.exports = TopCoin;
