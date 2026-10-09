import mongoose from "mongoose";
import OrderModel from "../../models/orders.model.js";
import OrderItemModel from "../../models/orderItems.model.js";
import paymentModel from "../../models/payment.model.js";
import productModel from "../../models/product.model.js"; // adjust filename/path to match your actual product model
import CartProduct from "../../models/cartProduct.model.js";
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

      for (const item of orderData.orderData.orderItems) {
        const updatedProduct = await productModel.findOneAndUpdate(
          { _id: item.productId, stock: { $gte: item.quantity } },
          { $inc: { stock: -item.quantity } },
          { session, new: true },
        );

        if (!updatedProduct) {
          throw new Error(
            `Insufficient stock for product ${item.productName || item.productId}`,
          );
        }
      }

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
      const userId = orderData?.orderData?.userId;
      order.paymentId = payment._id;

      await order.save({ session });

      await CartProduct.deleteMany(
        { userId, productId: { $in: productIds } },
        { session },
      );
    });

    return { order, payment };
  } catch (error) {
    console.error("saveOrder failed:", error);
    throw new Error(`Order failed: ${error.message}`);
  } finally {
    session.endSession();
  }
};

const mapOrderListItem = (order, itemCount = 0) => ({
  _id: order._id,
  orderNumber: order.orderId,
  customer: order.userId?.name || "",
  items: itemCount,
  totalAmount: order.totalAmt,
  paymentStatus: order.paymentStatus,
  orderStatus: order.orderStatus,
  createdAt: order.createdAt,
});

export const getUserOrders = async (userId) => {
  if (!userId) {
    throw new Error("UserId is required.");
  }

  const orders = await OrderModel.find({ userId })
    .populate("userId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  if (!orders.length) {
    return [];
  }

  const orderObjectIds = orders.map((order) => order._id);

  const itemCounts = await OrderItemModel.aggregate([
    {
      $match: {
        orderId: { $in: orderObjectIds },
      },
    },
    {
      $group: {
        _id: "$orderId",
        items: { $sum: "$quantity" },
      },
    },
  ]);

  const itemCountByOrderId = new Map(
    itemCounts.map((entry) => [String(entry._id), entry.items]),
  );

  return orders.map((order) =>
    mapOrderListItem(
      order,
      itemCountByOrderId.get(String(order._id)) || order.productIds?.length || 0,
    ),
  );
};

export const getOrderById = async (userId, orderId) => {
  if (!userId) {
    throw new Error("UserId is required.");
  }

  if (!orderId) {
    throw new Error("OrderId is required.");
  }

  const order = await OrderModel.findOne({
    _id: orderId,
    userId,
  })
    .populate("userId", "name email")
    .populate("deliveryAddress")
    .populate("paymentId")
    .lean();

  if (!order) {
    throw new Error("Order not found.");
  }

  const orderItems = await OrderItemModel.find({
    orderId: order._id,
  }).lean();

  const itemCount = orderItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0,
  );

  return {
    ...mapOrderListItem(order, itemCount),
    deliveryAddress: order.deliveryAddress || null,
    payment: order.paymentId || null,
    orderItems,
  };
};
