const mongoose = require("mongoose");

const cryptoVotingListSchema = new mongoose.Schema({
  coins: [
    {
      id: String,
      symbol: String,
      name: String,
      image: String,
      price_change_percentage_24h: Number,
      listed_price: Number, // Assuming it's the initial price
      market_cap: Number,
      volume_24h: Number,
      votes: [
        {
          user_id: mongoose.Schema.Types.ObjectId, // Reference to user
        },
      ],
    },
  ],
  list_date: { type: String, required: true }, // Example: "27.03.2025"
  updated_at: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Active", "Archive"], // Allowed values
    default: "Active", // Default value
  },
});

const CryptoVotingList = mongoose.model(
  "crypto_voting_list",
  cryptoVotingListSchema
);
module.exports = CryptoVotingList;
