import Product from "../../models/Product.js";
import Category from "../../models/category.model.js";

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
  return Product.findOne({
    _id: id,
    isActive: true,
  }).populate("category", "name slug");
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

  return product;
};

export const deleteProduct = async (id) => {
  return Product.deleteOne({
    _id: id,
  });
};