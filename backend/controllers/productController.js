import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.json(product);
};

export const getProducts = async (req, res) => {
  const minPrice = req.query.minPrice || 0;
  const products = await Product.find({ price: { $gte: minPrice } });
  res.json(products);
};