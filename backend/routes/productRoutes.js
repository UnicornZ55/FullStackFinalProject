import express from "express"
import Product from "../models/Product.js"
import { protect } from "../middleware/protect.js"
import { restrictTo } from "../middleware/restrict.js"
import mongoose from "mongoose"

const router = express.Router()

// GET all products
router.get("/", async (req,res)=>{

  try{

    const products = await Product.find()

    res.json(products)

  }
  catch(err){

    res.status(500).json({message:"Server error"})

  }

})


// CREATE product (admin only)
router.post("/", protect, restrictTo("admin"), async (req,res)=>{

  try{

    const product = await Product.create(req.body)

    res.json(product)

  }
  catch(err){

    res.status(500).json({message:"Server error"})

  }

})


// GET product by id
router.get("/:id", async (req,res)=>{

  try{

    const { id } = req.params

    // ⭐ ป้องกัน invalid ObjectId
    if(!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).json({message:"Product not found"})
    }

    const product = await Product.findById(id)

    // ⭐ ถ้าไม่มี product
    if(!product){
      return res.status(404).json({message:"Product not found"})
    }

    res.json(product)

  }
  catch(err){

    res.status(500).json({message:"Server error"})

  }

})

export default router