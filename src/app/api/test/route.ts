import { connectToDatabase } from "@/lib/databaseConnection";
import { NextResponse } from "next/server";


export async function GET() {
    await connectToDatabase();
    return NextResponse.json({
        success: true,
        message: "Database connected successfully",
    })
}