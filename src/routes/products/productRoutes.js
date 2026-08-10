import express from "express";
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from "../../controller/product/productController.js";
import {authMiddleware, authorize} from "../../middlewares/auth.js";
const productproductRouter = express.productRouter();

productRouter.get("/",getProducts);

productRouter.get("/:id", getProductById);

productRouter.post("/", authMiddleware, authorize("admin"), createProduct);

productRouter.put("/:id", authMiddleware, authorize("admin"), updateProduct);

productRouter.delete("/:id", authMiddleware, authorize("admin"), deleteProduct);

export default productproductRouter;
