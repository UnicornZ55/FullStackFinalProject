import express from "express"
import Order from "../models/Order.js"
import Product from "../models/Product.js"
import { protect } from "../middleware/protect.js"
import mongoose from "mongoose"

const router = express.Router()

// CREATE ORDER (atomic stock update)
router.post("/", protect, async (req,res)=>{

 const session = await mongoose.startSession()
 session.startTransaction()

 try{

  const { productId, quantity } = req.body
  console.log(req.user)
  if(!mongoose.Types.ObjectId.isValid(productId)){
   await session.abortTransaction()
   session.endSession()
   return res.status(404).json({message:"Product not found"})
  }

  const product = await Product.findById(productId).session(session)

  if(!product){
   await session.abortTransaction()
   session.endSession()
   return res.status(404).json({message:"Product not found"})
  }

  if(product.stock < quantity){
   await session.abortTransaction()
   session.endSession()
   return res.status(400).json({message:"Not enough stock"})
  }

  // reduce stock (atomic)
  await Product.updateOne(
   { _id: productId },
   { $inc: { stock: -quantity } },
   { session }
  )

  const totalPrice = product.price * quantity

  const order = await Order.create([{
   userId:req.user._id,
   productId,
   quantity,
   totalPrice
  }], { session })

  await session.commitTransaction()
  session.endSession()

  res.status(201).json(order[0])

 }
 catch(err){

  await session.abortTransaction()
  session.endSession()

  res.status(500).json({message:"Order failed"})
 }

})


// GET MY ORDERS
router.get("/", protect, async (req,res)=>{

 const orders = await Order.find({ userId:req.user._id })

 res.json(orders)

})

export default router