import Product from "../../models/Product.js";
import CartProduct from "../../models/cartProduct.model.js";
const addToCart = async (userId, productId, quantity = 1) => {
  if (!productId) {
    throw new Error("Product ID is required");
  }
  quantity = Number(quantity);
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  // Check stock
  if (product.stock < quantity) {
    throw new Error("Insufficient stock");
  }
  // Check whether product already exists in user's cart
  const existingCartProduct = await CartProduct.findOne({
    userId,
    productId,
  });
  if (existingCartProduct) {
    const newQuantity = existingCartProduct.quantity + quantity;

    if (newQuantity > product.stock) {
      throw new Error("Requested quantity exceeds available stock");
    }

    existingCartProduct.quantity = newQuantity;

    await existingCartProduct.save();

    return existingCartProduct;
  }

  const cartProduct = await CartProduct.create({
    userId,
    productId,
    quantity,
  });
  return cartProduct;
};

const getCart = async (userId) => {
  const cart = await CartProduct.find({
    userId,
  })
    .populate("productId")
    .sort({ createdAt: -1 });
  return cart;
};

const incrementQuantity = async (userid, productId) => {
  const product = await cartProduct.findOne({
    userId,
    productId,
  });
  if (!product) {
    throw new Error("Product Not found");
  }

  cartProduct.quantity += 1;
  await cartProduct.save();

  return cartProduct;
};

const decrementQuantity = async (userid, productId) => {
  const product = await cartProduct.findOne({
    userId,
    productId,
  });
  if (!product) {
    throw new Error("Product Not found");
  }

  cartProduct.quantity -= 1;
  await cartProduct.save();

  return cartProduct;
};

export { addToCart, getCart, incrementQuantity, decrementQuantity };
