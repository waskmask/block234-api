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
      required: true, // full_name is now required
    },
    city: {
      type: String, // Optional by default
    },
    country: {
      type: String, // Optional by default
    },
    dob: {
      type: String, // Storing as a string in DD-MM-YYYY format
      match: /^\d{2}-\d{2}-\d{4}$/, // Ensures format is DD-MM-YYYY
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Gender with predefined values
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
      required: false,
      default: "none",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("app_users", appUsersSchema);
