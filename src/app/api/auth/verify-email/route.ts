import { connectToDatabase } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";
import { jwtVerify } from "jose";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const { token } = await req.json();
    if (!token) {
      return response(false, 401, "Token is missing");
    }

    const secret = new TextEncoder().encode(process.env.SECRET_KEY);
    const decoded = await jwtVerify(token, secret);

    const userId = decoded.payload.userID;

    // Get user
    const user = await UserModel.findById(userId);
    if (!user) {
      return response(false, 404, "User not found");
    }

    user.isEmailVerified = true;
    await user.save();
    return response(true, 200, "Email verified successfully");
  } catch (error) {
    return catchError(error);
  }
}
