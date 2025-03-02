const mongoose = require("mongoose");

const SavedCoinSchema = new mongoose.Schema(
  {
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    votes: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        coin_id: { type: String, required: true }, // Coin's unique ID
        name: { type: String, required: true },
        symbol: { type: String, required: true },
        image: { type: String, required: true },
        current_price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavedCoin", SavedCoinSchema);
