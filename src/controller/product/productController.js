import * as productService from "../../services/product/productServices.js";
import Product from "../../models/Product.js";
import { decodeCursor, encodeCursor } from "../../utils/cursor.js";
export const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);

  res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

export const getProducts = async (req, res) => {
  try {
    console.log("request ", req?.query);

    const requestedLimit = Number(req.query.limit) || 20;

    const limit = Math.min(Math.max(requestedLimit, 1), 100);

    const { cursor, category } = req.query;

    // Base filter
    const filter = {
      isActive: true,
    };

    // Optional category filter
    if (category) {
      filter.category = category;
    }

    // Cursor condition
    if (cursor) {
      const decodedCursor = decodeCursor(cursor);

      if (!decodedCursor?.createdAt || !decodedCursor?.id) {
        return res.status(400).json({
          success: false,
          message: "Invalid cursor",
        });
      }

      const cursorDate = new Date(decodedCursor.createdAt);

      const cursorId = decodedCursor.id;

      // Products older than the cursor
      filter.$or = [
        {
          createdAt: {
            $lt: cursorDate,
          },
        },
        {
          createdAt: cursorDate,
          _id: {
            $lt: cursorId,
          },
        },
      ];
    }

    // Fetch one extra document
    // This helps us know if more products exist
    const products = await Product.find(filter)
      .select("name slug price category images stock createdAt")
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(limit + 1)
      .lean();

    const hasMore = products.length > limit;

    if (hasMore) {
      products.pop();
    }

    const lastProduct = products[products.length - 1];

    const nextCursor =
      hasMore && lastProduct ? encodeCursor(lastProduct) : null;

    return res.status(200).json({
      success: true,

      data: {
        products,
        nextCursor,
        hasMore,
      },
    });
  } catch (error) {
    console.error("Get products error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
      error: error.name,
    });
  }
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
