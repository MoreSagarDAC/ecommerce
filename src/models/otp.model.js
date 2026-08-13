import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phone_number: {
      type: String,
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    userData: {
      type: Object,
      default: {},
    },

    attempts: {
      type: Number,
      default: 0,
    },

    lastSentAt: {
      type: Date,
      default: Date.now,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Automatically delete expired OTP registration documents
otpSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const OtpModel = mongoose.model("Otp", otpSchema);

export default OtpModel;