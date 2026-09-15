import mongoose from "mongoose";
import OrderModel from "../../models/orders.model.js";
import OrderItemModel from "../../models/orderItems.model.js";
import paymentModel from "../../models/payment.model.js";
import { generateOrderId, generateTransactionId } from "../../utils/utils.js";

export const saveOrder = async (orderData) => {
  console.log("orderData : ", orderData);

  if (!orderData?.orderData?.userId) {
    throw new Error("UserId is required.");
  }
  if (!orderData?.orderData?.orderItems) {
    throw new Error("Without order items, order can't be saved.");
  }

  const deliveryAddress = orderData?.orderData?.deliveryAddress;

  if (!deliveryAddress) {
    throw new Error("Delivery address is required.");
  }

  const productIds = [
    ...new Set(
      orderData?.orderData.orderItems
        .map((item) => item?.productId)
        .filter(Boolean)
        .map((id) => String(id)),
    ),
  ];

  if (!productIds.length) {
    throw new Error("Each order item must include a productId.");
  }

  const subTotalAmt =
    orderData?.orderData.subTotalAmt ??
    orderData?.orderData.orderItems.reduce(
      (sum, item) => sum + Number(item.totalPrice || 0),
      0,
    );

  const totalAmt = orderData?.orderData?.totalAmt ?? subTotalAmt;
  const paymentData = orderData?.orderData?.paymentData || {};
  const transactionId = paymentData.transactionId || generateTransactionId();

  const session = await mongoose.startSession();

  try {
    let order, payment;

    await session.withTransaction(async () => {
      const orderId = generateOrderId();

      const [createdOrder] = await OrderModel.create(
        [
          {
            orderId,
            userId: orderData?.orderData?.userId,
            productIds,
            deliveryAddress,
            subTotalAmt,
            totalAmt,
            paymentStatus: orderData?.orderData?.paymentStatus || "PENDING",
            orderStatus: orderData?.orderData?.orderStatus || "PENDING",
          },
        ],
        { session },
      );
      order = createdOrder;

      const itemsWithOrderId = orderData?.orderData?.orderItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        productName: item.productName,
        productImage: item.productImage || "",
        price: item.price,
        totalPrice: item.totalPrice,
        orderId: order._id,
      }));
      await OrderItemModel.insertMany(itemsWithOrderId, { session });

      const [createdPayment] = await paymentModel.create(
        [
          {
            orderId: order._id,
            userId: orderData?.orderData?.userId,
            amount: totalAmt,
            currency: paymentData.currency ?? "INR",
            method: paymentData.method ?? "ONLINE",
            status: "PENDING",
            transactionId,
          },
        ],
        { session },
      );
      payment = createdPayment;

      order.paymentId = payment._id;
      console.log("session : ", session);

      await order.save({ session });
    });

    return { order, payment };
  } catch (error) {
    console.error("saveOrder failed:", error);
    throw new Error(`Order failed: ${error.message}`);
  } finally {
    session.endSession();
  }
};
