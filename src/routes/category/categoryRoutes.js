import express from "express";
import {
  createCategoryController,
  fetchAllCategories,
} from "../../controller/category/category.js";
import  {authMiddleware, authorize} from "../../middlewares/auth.js";
const CategoryRouter = express.Router();

CategoryRouter.post("/create", authMiddleware,authorize("admin"), createCategoryController);
CategoryRouter.get("/all", authMiddleware, fetchAllCategories);

export default CategoryRouter;
