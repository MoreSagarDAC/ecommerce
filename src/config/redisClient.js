import { createClient } from "redis";

// Use 127.0.0.1 (not localhost). On Windows, localhost often resolves to ::1
// while Redis is bound only to IPv4 127.0.0.1, so the client never connects.
const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  // Windows Redis from "Program Files" is typically 3.x/5.x and has no HELLO
  // (RESP3). node-redis v4+ sends HELLO 3 by default — force RESP2.
  RESP: 2,
});

redisClient.on("connect", () => {
  console.log("Redis connecting...");
});

redisClient.on("ready", () => {
  console.log("Redis ready");
});

redisClient.on("error", (error) => {
  console.error("Redis Client Error:", error.message);
});

redisClient.on("end", () => {
  console.warn("Redis connection closed");
});

const connectRedis = async () => {
  try {
    if (!redisClient.isOpen) {
      await redisClient.connect();
      console.log("Redis connect succussfully");
    }
  } catch (error) {
    console.error("Redis connection failed:", error.message);
    throw error;
  }
};

export { redisClient, connectRedis };
