import express from "express"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import { protect } from "../middleware/protect.js"

const router = express.Router()

// CREATE ORDER (atomic stock update)
router.post("/", protect, async (req, res) => {
  const { productId, quantity } = req.body

  const product = await Product.findById(productId)

  if (!product || product.stock < quantity) {
    return res.status(400).json({ message: "Not enough stock" })
  }

  product.stock -= quantity
  await product.save()

  const order = await Order.create({
    userId: req.user._id,
    productId,
    quantity,
    totalPrice: product.price * quantity
  })

  res.json(order)
})

// GET MY ORDERS
router.get("/", protect, async (req, res) => {
  const orders = await Order.find({ userId: req.user._id })
  res.json(orders)
})

export default router