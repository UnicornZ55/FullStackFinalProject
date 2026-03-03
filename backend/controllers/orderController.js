import Product from "../models/Product.js";
import Order from "../models/Order.js";

export const createOrder = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);
  if (!product || product.stock < quantity) {
    return res.status(400).json({ message: "Not enough stock" });
  }

  product.stock -= quantity;
  await product.save();

  const order = await Order.create({
    productId,
    quantity,
    totalPrice: product.price * quantity
  });

  res.json(order);
};