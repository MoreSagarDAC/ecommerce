import {
  createAddress,
  getAllAddress,
} from "../../../services/order/address/addressServices.js";

const createNewAddress = async (req, res) => {
  try {
    const address = await createAddress(req.body);

    return res.status(201).json({
      success: true,
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    console.error("Controller error:", error);

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const allAddresses = async (req, res) => {
  try {
    const address = await getAllAddress(req.user?.id);
    return res.status(200).json({
      address,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export { createNewAddress, allAddresses };
