import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL || "";

let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URL, {
        dbName: "ECommerce_Web",
        bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;

  return cached.conn;
};
