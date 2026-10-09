import express from "express";

import {
  saveNewOrder,
  getOrders,
  getOrder,
} from "../../controller/order/orderController.js";
import { authMiddleware } from "../../middlewares/auth.js";

const orderRouter = express.Router();

orderRouter.use(authMiddleware);

orderRouter.post("/create", saveNewOrder);
orderRouter.get("/", getOrders);
orderRouter.get("/:orderId", getOrder);

export { orderRouter };
