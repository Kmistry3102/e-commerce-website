import { connectToDatabase } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { verifyOtpSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const payload = await req.json();

    const parsed = verifyOtpSchema.safeParse(payload);
    if (!parsed.success) {
      return response(false, 400, "Invalid or missing input fields", parsed.error.format());
    }

    const { email, otp } = parsed.data;

    // 1) Find OTP
    const otpDoc = await OTPModel.findOne({ email, otp });
    if (!otpDoc) {
      return response(false, 400, "Invalid or expired OTP.");
    }

    // 1a) Optional hard expiry check (in case TTL monitor hasn’t run yet)
    if ((otpDoc as any).expiresAt && new Date(otpDoc.expiresAt) < new Date()) {
      await otpDoc.deleteOne().catch(() => {});
      return response(false, 400, "OTP has expired. Please request a new one.");
    }

    // 2) Find user
    const user = await UserModel.findOne({ deletedAt: null, email }).lean();
    if (!user) {
      return response(false, 404, "User not found.");
    }

    // 5) Remove OTP after successful validation (and optionally clear all for this email)
    await otpDoc.deleteOne();

    return response(true, 200, "Login Successful.");
  } catch (error) {
    return catchError(error);
  }
}
