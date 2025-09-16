import { otpEmail } from "@/email/otpEmail";
import { connectToDatabase } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { resetPasswordSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const payload = await req.json();

    const parsed = await resetPasswordSchema.safeParse(payload);
    if (!parsed.success) {
      return response(false, 400, "Invalid or missing input field");
    }

    const { email } = parsed.data;

    const getUser = await UserModel.findOne({ deletedAt: null, email }).lean();
    if (!getUser) {
      return response(false, 404, "User not found");
    }

    await OTPModel.deleteMany({ email });
    const otp = generateOTP();
    await new OTPModel({ email, otp }).save();

    // Send OTP via email
    const mail = await sendMail(
      "Your login verification code",
      email,
      otpEmail(otp)
    );
    if (!mail?.success) {
      return response(false, 500, "Failed to send OTP. Please try again.");
    }

    return response(true, 200, "Please Verify your account");
  } catch (error) {
    return catchError(error);
  }
}
