import express from "express"
import Product from "../models/Product.js"
import { protect } from "../middleware/protect.js"
import { restrictTo } from "../middleware/restrict.js"

const router = express.Router()

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find()
  res.json(products)
})

// CREATE product (admin only)
router.post("/", protect, restrictTo("admin"), async (req, res) => {
  const product = await Product.create(req.body)
  res.json(product)
})

export default router