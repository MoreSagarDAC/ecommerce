import { saveOrder } from "../../services/order/orderServices.js";

export const saveNewOrder = async (req, res) => {
  try {
    // console.log("order : ", req.body);
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
