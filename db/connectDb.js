import mongoose from "mongoose";

export const connectDb = async () => {
    await mongoose.connect(process.env.DATABASE_CONNECTION_STRING);
    console.log("Database connected")
}