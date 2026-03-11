import express from "express"
import Product from "../models/Product.js"
import { protect } from "../middleware/protect.js"
import { restrictTo } from "../middleware/restrict.js"
import mongoose from "mongoose"

const router = express.Router()

// GET all products + filter price
router.get("/", async (req,res)=>{

 try{

  const { category, brand, age, minPrice, maxPrice, search } = req.query

  const filter = {}

  // category filter function 4.4 C2
  if(category){

   const arr = Array.isArray(category)
    ? category
    : category.split(",")

   filter.category = { $in: arr }

  }

  // brand filter
  if(brand){

   const arr = Array.isArray(brand)
    ? brand
    : brand.split(",")

   filter.brand = { $in: arr }

  }

  // age filter
  if(age){

   const arr = Array.isArray(age)
    ? age
    : age.split(",")

   filter.age = { $in: arr }

  }

  // price range
  if(minPrice || maxPrice){

   filter.price = {}

   if(minPrice) filter.price.$gte = Number(minPrice)

   if(maxPrice) filter.price.$lte = Number(maxPrice)

  }

  // search
  if(search){

   filter.name = {
    $regex: search,
    $options: "i"
   }

  }

  const products = await Product.find(filter)

  res.json(products)

 }
 catch(err){

  res.status(500).json({message:"Server error"})

 }

})

router.get("/search", async (req,res)=>{

 try{

  const { tags, page=1, limit=5 } = req.query

  let filter = {}

  // C1 + C2 Multi-tag search
  if(tags){

   const tagArray = tags.split(",")

   filter.tags = { $all: tagArray }

  }

  // C3 Pagination
  const skip = (Number(page) - 1) * Number(limit)

  const products = await Product
   .find(filter)
   .sort({ createdAt:-1 })
   .skip(skip)
   .limit(Number(limit))

  // C4 metadata
  const totalPosts = await Product.countDocuments(filter)

  const totalPages = Math.ceil(totalPosts / limit)

  res.json({
   metadata:{
    totalPosts,
    totalPages,
    currentPage:Number(page)
   },
   data:products
  })

 }
 catch(err){

  res.status(500).json({message:"Server error"})

 }

})

router.get("/stats", async (req,res)=>{

 try{

  const stats = await Product.aggregate([
   {
    $addFields:{
     salePrice:{
      $multiply:[
       "$price",
       { $subtract:[1,{ $divide:["$discountPercent",100]}] }
      ]
     }
    }
   },
   {
    $group:{
     _id:null,
     avgSalePrice:{ $avg:"$salePrice" },
     maxSalePrice:{ $max:"$salePrice" }
    }
   }
  ])

  if(stats.length === 0){

   return res.json({
    avgSalePrice:0,
    maxSalePrice:0
   })

  }

  res.json(stats[0])

 }
 catch(err){

  res.status(500).json({message:"Server error"})

 }

})

// CREATE product (admin only)
router.post("/", protect, restrictTo("admin"), async (req,res)=>{

 try{

  const product = await Product.create(req.body)

  res.status(201).json(product)

 }
 catch(err){

  // validation error
  if(err.name === "ValidationError"){
   return res.status(400).json({message: err.message})
  }

  // duplicate key (unique name)
  if(err.code === 11000){
   return res.status(400).json({message:"Product name already exists"})
  }

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

// PATCH product (partial update)
router.patch("/:id", protect, restrictTo("admin", "manager"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updates = req.body;

    const product = await Product.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE product
router.delete("/:id", protect, restrictTo("admin", "manager"), async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router