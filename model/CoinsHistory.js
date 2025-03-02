const mongoose = require("mongoose");

const CoinsHistorySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true }, // Format: YYYY-MM-DD
  coins: { type: Array, default: [] }, // Store all coins data
});

module.exports = mongoose.model("CoinsHistory", CoinsHistorySchema);
