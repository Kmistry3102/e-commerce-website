import { emailVerificationLink } from "@/email/emailVerificationLink";
import { otpEmail } from "@/email/otpEmail";
import { connectToDatabase } from "@/lib/databaseConnection";
import { catchError, generateOTP, response } from "@/lib/helperFunction";
import { sendMail } from "@/lib/sendMail";
import { loginSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const payload = await req.json();
    const parsed = loginSchema.safeParse(payload);
    if (!parsed.success) {
      // send field errors back (flatten if you prefer)
      return response(false, 400, "Invalid or missing input fields", parsed.error.format());
    }

    const { email, password } = parsed.data;

    // 1) Find user
    const user = await UserModel.findOne({ deletedAt: null, email }).select("+password");
    if (!user) {
      return response(false, 404, "Invalid login credentials");
    }

    // 2) If NOT verified, resend verification link and stop
    if (!user.isEmailVerified) {
      const secret = new TextEncoder().encode(process.env.SECRET_KEY);
      const token = await new SignJWT({ userID: user._id.toString() })
        .setIssuedAt()
        .setExpirationTime("1h")
        .setProtectedHeader({ alg: "HS256" })
        .sign(secret);

      await sendMail(
        "Verify your email",
        email,
        emailVerificationLink(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/verify-email/${token}`)
      );

      return response(
        false, // still not allowed to log in
        403,
        "Your email is not verified. We've sent a new verification link to your email."
      );
    }

    // 3) Check password
    const isPasswordOK = await user.comparePassword(password);
    if (!isPasswordOK) {
      return response(false, 400, "Invalid login credentials");
    }

    // 4) Create fresh OTP for 2FA (login step)
    await OTPModel.deleteMany({ email }); // clear old OTPs
    const otp = generateOTP();
    await new OTPModel({ 
      email, 
      otp, 
      expiresAt: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    }).save();

    // Optionally: send OTP by email/SMS here
    const otpEmailStatus = await sendMail('Your Login verification Code', email, otpEmail(otp));

    if(!otpEmailStatus.success){
      return response(false, 400, 'Failed to send OTP')
    }

    return response(true, 200, "OTP sent to your email/phone. Continue verification.");
  } catch (err) {
    return catchError(err);
  }
}
