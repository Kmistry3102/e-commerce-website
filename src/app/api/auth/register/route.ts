import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectToDatabase } from "@/lib/databaseConnection";
import { signupSchema } from "@/lib/zodSchema";
import { response } from "@/lib/helperFunction";
import UserModel from "@/models/User.model";

// bcrypt (and DB drivers) require Node APIs, not Edge.
export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    // 1) Parse JSON body
    const body = await req.json();

    // 2) Validate with Zod (same schema you use on the client)
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
        const { fieldErrors } = parsed.error.flatten();
      return response("false", 401, "Invalid or missing input field", fieldErrors);
    }

    // 3) Extract validated values
    const { fullName, email, password } = parsed.data; // confirmPassword already checked by schema

    // 4) Check for existing user
    const existing = await UserModel.exists({ email });
    if (existing) {
       return response("false", 409, "Email already registered");
    }

    // 5) New Registration
    const NewRegistration = new UserModel({
        fullName, email, password
    })

    await NewRegistration.save();

    // 6) Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // 7) Create user (adjust fields to your model)
    const user = await UserModel.create({
      fullName,
      email,
      password: passwordHash, // or `passwordHash` if your schema uses that key
    });

    // 8) Return success (avoid sending password/hash back)
    return NextResponse.json(
      {
        ok: true,
        user: { id: user._id.toString(), fullName: user.fullName, email: user.email },
        message: "Account created successfully",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Register POST error:", err);
    return NextResponse.json(
      { ok: false, message: "Something went wrong" },
      { status: 500 }
    );
  }
}
