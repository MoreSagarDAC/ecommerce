import * as cartService from "../../services/cart/cartServices.js";

const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const userId = req.user.id;
    const result = await cartService.addToCart(userId, productId, quantity);

    return res.status(201).json({
      success: true,
      message: "Product added to cart",
      data: result,
    });
  } catch (error) {
    console.error("🔥 ADD TO CART ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cartProducts = await cartService.getCart(userId);
    return res.status(200).json({
      success: true,
      message: "cart products",
      data: cartProducts,
    });
  } catch (error) {
    console.error("CART ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const incrementQty = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    await cartService.incrementQuantity({
      userid,
      productId,
    });
    return res.status(200).json({
      success: true,
      message: "Product Qty Increased",
    });
  } catch (error) {
    console.error("CART ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const decrementQty = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    await cartService.decrementQuantity({
      userid,
      productId,
    });
    return res.status(200).json({
      success: true,
      message: "Product Qty Decreased",
    });
  } catch (error) {
    console.error("CART ERROR:", error);
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export { addToCart, getCart, incrementQty, decrementQty };
