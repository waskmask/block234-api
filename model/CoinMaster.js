const mongoose = require("mongoose");

const CoinMasterSchema = new mongoose.Schema(
  {
    symbol: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    rank: {
      type: Number,
      required: true,
    },
  },
  { timestamps: false }
);

const CoinMaster = mongoose.model("coin_master", CoinMasterSchema);
module.exports = CoinMaster;
