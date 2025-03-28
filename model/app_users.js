const mongoose = require("mongoose");

const appUsersSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      required: true, // Updated to `true` since it's replacing `name`
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    verification: {
      type: Boolean,
      required: true,
    },
    verification_token: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    crypto_exp: {
      type: String,
      enum: [
        "none",
        "beginner",
        "intermediate",
        "advanced",
        "expert",
        "miner-developer",
      ],
      required: false, // Change to `true` if this field is mandatory
      default: "none", // Default value if not provided
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("app_users", appUsersSchema);
