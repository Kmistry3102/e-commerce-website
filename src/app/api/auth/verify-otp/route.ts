import { connectToDatabase } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { verifyOtpSchema } from "@/lib/zodSchema";
import OTPModel from "@/models/Otp.model";
import UserModel from "@/models/User.model";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

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

    // 3) Prepare JWT payload
    const loggedInUserData = {
      _id: String(user._id),
      role: user.role,
      // Use your actual field name here (likely "fullName")
      name: (user as any).fullName ?? (user as any).name ?? "",
      avatar: (user as any).avatar ?? null,
    };

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const token = await new SignJWT(loggedInUserData)
      .setIssuedAt()
      .setExpirationTime("24h")
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    // 4) Set cookie
    const cookieStore = await cookies(); 
    cookieStore.set({
      name: "access_token",
      value: token,
      httpOnly: true, // recommended always true
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // You can add expires/maxAge if you want cookie lifetime to match JWT
    });

    // 5) Remove OTP after successful validation (and optionally clear all for this email)
    await otpDoc.deleteOne();
    // Optionally: await OTPModel.deleteMany({ email });

    return response(true, 200, "Login Successful", loggedInUserData);
  } catch (error) {
    return catchError(error);
  }
}
