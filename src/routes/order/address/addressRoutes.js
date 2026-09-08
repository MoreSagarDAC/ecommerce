import express from "express";

import {
  createNewAddress,
  allAddresses,
} from "../../../controller/order/address/addressController.js";
import { authMiddleware } from "../../../middlewares/auth.js";

const addressRouter = express.Router();

addressRouter.post("/create", authMiddleware, createNewAddress);
addressRouter.get("/user/:userId", authMiddleware, allAddresses);

export default addressRouter;
