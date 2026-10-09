import {
  saveOrder,
  getUserOrders,
  getOrderById,
} from "../../services/order/orderServices.js";

export const saveNewOrder = async (req, res) => {
  try {
    const order = await saveOrder(req?.body);

    return res.status(201).json({
      success: true,
      message: "Order created successfully.",
      data: order,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await getUserOrders(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Orders fetched successfully.",
      data: orders,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await getOrderById(req.user.id, req.params.orderId);

    return res.status(200).json({
      success: true,
      message: "Order fetched successfully.",
      data: order,
    });
  } catch (error) {
    const statusCode = error.message === "Order not found." ? 404 : 400;

    return res.status(statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
