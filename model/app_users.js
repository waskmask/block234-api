const mongoose = require("mongoose");
const shortid = require("shortid");

const appUsersSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      default: () => shortid.generate(),
    },
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
      enum: ["male", "female", "other"], // Gender with predefined values
    },
    fake_email: {
      type: Boolean,
      default: false, // Default is false
      required: true,
    },
    verification: {
      type: Boolean,
      required: true,
    },
    verification_token: {
      type: String,
      required: true,
    },
    forgotPasswordToken: {
      token: String,
      expiresAt: Date,
    },
    profileImage: { type: String },
    aboutUs: { type: String },
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
