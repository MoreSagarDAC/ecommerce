import mongoose from "mongoose";
import { connectRedis } from "./redisClient.js";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error("MongoDB Connection Error:", error.message);
    process.exit(1);
  }

  try {
    await connectRedis();
  } catch (error) {
    console.error("Redis is unavailable; cache will be skipped:", error.message);
  }
};

export default connectDB;
