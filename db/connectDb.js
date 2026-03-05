import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
    console.log("Database connected 🚀");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};