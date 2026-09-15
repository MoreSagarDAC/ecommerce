import express from "express";

import { saveNewOrder } from "../../controller/order/orderController.js";
import { authMiddleware } from "../../middlewares/auth.js";

const orderRouter = express.Router();

orderRouter.post("/create", authMiddleware, saveNewOrder);

export { orderRouter };
