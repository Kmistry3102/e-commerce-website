import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    otp:   { type: String, required: true },

    // must be Date and must return a value
    expiresAt: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
    },
  },
  { timestamps: true }
);

// TTL: expire at the time stored in expiresAt
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const OTPModel =
  mongoose.models.OTP || mongoose.model("OTP", otpSchema, "otps");

export default OTPModel;
