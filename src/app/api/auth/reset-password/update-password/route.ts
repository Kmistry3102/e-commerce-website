import { connectToDatabase } from "@/lib/databaseConnection";
import { catchError, response } from "@/lib/helperFunction";
import { updatePasswordSchema } from "@/lib/zodSchema";
import UserModel from "@/models/User.model";
import bcrypt from "bcryptjs";

export async function PUT(req: Request) {
  try {
    await connectToDatabase();
    const payload = await req.json();

    const parsed = updatePasswordSchema.safeParse(payload);
    if (!parsed.success) {
      return response(false, 400, "Invalid or missing input fields", parsed.error.format());
    }

    const { email, password } = parsed.data;

    // Find the user
    const user = await UserModel.findOne({ deletedAt: null, email });
    if (!user) {
      return response(false, 404, "User not found");
    }

    // Hash the new password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Update the user's password
    await UserModel.findByIdAndUpdate(user._id, {
      password: hashedPassword,
      updatedAt: new Date()
    });

    return response(true, 200, "Password updated successfully");
  } catch (error) {
    return catchError(error);
  }
}