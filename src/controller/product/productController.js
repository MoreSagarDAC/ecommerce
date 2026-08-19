import * as productService from "../../services/product/productServices.js";

export const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

export const getProducts = async (req, res) => {
  const products = await productService.getProducts();

  res.status(200).json({
    success: true,
    data: products,
  });
};

export const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    data: product,
  });
};

export const updateProduct = async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

export const deleteProduct = async (req, res) => {
  const result = await productService.deleteProduct(req.params.id);

  if (result.deletedCount === 0) {
    return res.status(404).json({
      success: false,
      message: "Product not found", 
    });
  }

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};
