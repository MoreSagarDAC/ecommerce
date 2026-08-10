import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../../controller/product/productController.js";
import { authMiddleware, authorize } from "../../middlewares/auth.js";
const productRouter = express.Router();

productRouter.get("/", getProducts);

productRouter.get("/:id", getProductById);

productRouter.post("/", authMiddleware, authorize("ADMIN"), createProduct);

productRouter.put("/:id", authMiddleware, authorize("ADMIN"), updateProduct);

productRouter.delete("/:id", authMiddleware, authorize("ADMIN"), deleteProduct);

export default productRouter;
