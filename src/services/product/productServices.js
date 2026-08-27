import Product from "../../models/Product.js";
import Category from "../../models/category.model.js";
import {
  getCache,
  setCache,
  deleteCache,
} from "../../config/shared/cache/redis.service.js";
import { CACHE_KEYS } from "../../config/shared/cache/cacheKeys.js";

const PRODUCT_CACHE_TTL = 60 * 10;

export const createProduct = async (data) => {
  const product = await Product.create(data);

  // Populate category information
  return await product.populate("category", "name slug");
};

export const getProducts = async () => {
  return Product.find({
    isActive: true,
  })
    .populate("category", "name slug")
    .sort({
      createdAt: -1,
    });
};

export const getProductById = async (id) => {
  const start = performance.now();

  const cacheKey = CACHE_KEYS.product.byId(id);

  const cachedProduct = await getCache(cacheKey);

  if (cachedProduct) {
    const duration = (performance.now() - start).toFixed(2);

    console.log(`[REDIS HIT] ${cacheKey} | ${duration}ms`);

    return cachedProduct;
  }

  console.log(`[REDIS MISS] ${cacheKey}`);

  const product = await Product.findOne({
    _id: id,
    isActive: true,
  })
    .populate("category", "name slug")
    .lean();

  if (!product) {
    return null;
  }

  await setCache(cacheKey, product, PRODUCT_CACHE_TTL);

  const duration = (performance.now() - start).toFixed(2);

  console.log(`[MONGODB] ${cacheKey} | ${duration}ms`);

  return product;
};

export const updateProduct = async (id, data) => {
  if (data.category) {
    const category = await Category.findById(data.category);

    if (!category || !category.isActive) {
      throw new Error("Invalid category");
    }
  }

  const product = await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).populate("category", "name slug");

  // MongoDB updated successfully
  // Now remove old Redis data
  if (product) {
    await deleteCache(CACHE_KEYS.product.byId(id));
  }

  return product;
};

export const deleteProduct = async (id) => {
  const result = await Product.deleteOne({
    _id: id,
  });

  // Only invalidate cache if MongoDB delete succeeded
  if (result.deletedCount > 0) {
    await deleteCache(CACHE_KEYS.product.byId(id));
  }

  return result;
};
