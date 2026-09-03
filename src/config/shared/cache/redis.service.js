import { redisClient } from "../../redisClient.js";

const isRedisAvailable = () => {
  return redisClient.isReady;
};

export const getCache = async (key) => {
  if (!isRedisAvailable()) {
    return null;
  }

  try {
    const cachedValue = await redisClient.get(key);

    if (!cachedValue) {
      return null;
    }

    return JSON.parse(cachedValue);
  } catch (error) {
    console.error(`Redis GET failed for ${key}:`, error.message);

    return null;
  }
};

export const setCache = async (key, value, ttlSeconds) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    // await redisClient.set(key, JSON.stringify(value), {
    //   EX: ttlSeconds,
    // });
      await redisClient.setEx(
    cacheKey,
    300,
    JSON.stringify(product)
  );

    return true;
  } catch (error) {
    console.error(`Redis SET failed for ${key}:`, error.message);

    return false;
  }
};

export const deleteCache = async (key) => {
  if (!isRedisAvailable()) {
    return false;
  }

  try {
    await redisClient.del(key);

    return true;
  } catch (error) {
    console.error(`Redis DELETE failed for ${key}:`, error.message);

    return false;
  }
};
