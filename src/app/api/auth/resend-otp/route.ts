import { connectToDatabase } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { resendOtpSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { sendMail } from "@/lib/sendMail";
import { otpEmail } from "@/email/otpEmail";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const payload = await req.json();

    // Validate input
    const parsed = resendOtpSchema.safeParse(payload);
    if (!parsed.success) {
      return response(false, 400, "Invalid or missing input fields", parsed.error.format());
    }
    const { email } = parsed.data;

    // Ensure user exists (and is active)
    const user = await UserModel.findOne({ deletedAt: null, email }).lean();
    if (!user) {
      return response(false, 404, "User not found.");
    }

    // If you only allow OTP for verified emails, keep this guard:
    if (!user.isEmailVerified) {
      return response(false, 403, "Your email is not verified. Please verify to continue.");
    }

    // Clear previous OTPs and create a fresh one (model TTL handles expiry)
    await OTPModel.deleteMany({ email });
    const otp = generateOTP();
    await new OTPModel({ email, otp }).save();

    // Send OTP via email
    const mail = await sendMail("Your login verification code", email, otpEmail(otp));
    if (!mail?.success) {
      return response(false, 500, "Failed to send OTP. Please try again.");
    }

    return response(true, 200, "A new OTP has been sent to your email.");
  } catch (error) {
    return catchError(error);
  }
}
