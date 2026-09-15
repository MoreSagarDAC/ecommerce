import mongoose from "mongoose";
import { paymentStatus, orderStatus } from "../utils/constant.js";

const orderSchema = mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    productIds: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
      ],
      required: true,
      validate: {
        validator: (ids) => Array.isArray(ids) && ids.length > 0,
        message: "At least one product is required.",
      },
    },
    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "payment",
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: paymentStatus,
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: orderStatus,
      default: "PENDING",
    },
    deliveryAddress: {
      type: mongoose.Schema.ObjectId,
      ref: "address",
    },
    subTotalAmt: {
      type: Number,
      default: 0,
    },
    totalAmt: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

const OrderModel = mongoose.model("orders", orderSchema);
export default OrderModel;
