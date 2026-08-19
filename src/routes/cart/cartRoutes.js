import express from "express";
import {
  addToCart,
  getCart,
  incrementQty,
  decrementQty,
} from "../../controller/cart/cartController.js";
import { authMiddleware } from "../../middlewares/auth.js";

const cartRouter = express.Router();
cartRouter.use(authMiddleware);

cartRouter.post("/addToCart", addToCart);
cartRouter.get("/", getCart);
cartRouter.patch("/:productId/increment", incrementQty);
cartRouter.patch("/:productId/decrement", decrementQty);

export default cartRouter;
