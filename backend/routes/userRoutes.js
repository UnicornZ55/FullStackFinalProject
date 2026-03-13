import express from "express"
import User from "../models/User.js"
import { protect } from "../middleware/protect.js"
import { restrictTo } from "../middleware/restrict.js"

const router = express.Router()

// get users (exclude deleted)

router.get("/", protect, restrictTo("admin"), async(req,res)=>{

 const users = await User.find({isDeleted:false})

 res.json(users)

})

//post user (register)
router.post("/", async (req,res)=>{

 try{

  const {username,email,password,role} = req.body

  if(!username || !email || !password){
   return res.status(400).json({message:"Missing required fields"})
  }

  const user = await User.create({
   username,
   email,
   password,
   role
  })

  res.status(201).json({
   _id:user._id,
   email:user.email,
   role:user.role
  })

 }
 catch(err){
    
    console.error(err)

  if(err.code === 11000){
   return res.status(400).json({
    message:"Email already exists"
   })
  }

  res.status(500).json({message:err.message})
 }

})

// soft delete

router.delete("/:id", protect, restrictTo("admin"), async(req,res)=>{

 const user = await User.findById(req.params.id)

 if(!user){
  return res.status(404).json({message:"User not found"})
 }

 user.isDeleted = true
 user.deletedAt = new Date()

 await user.save()

 res.json({
  message:"User soft deleted"
 })

})

// update current user (for C3 test)
router.put("/me", protect, async (req,res)=>{

 try{

  const user = await User.findById(req.user._id)

  if(!user){
   return res.status(404).json({message:"User not found"})
  }

  if(req.body.username){
   user.username = req.body.username
  }

  await user.save()

  res.json({
   message:"Profile updated",
   username:user.username
  })

 }
 catch(err){

  res.status(500).json({message:"Server error"})

 }

})

// change password (for C2 test)

router.put("/change-password", protect, async (req,res)=>{

 try{

  const { password } = req.body

  const user = await User.findById(req.user._id).select("+password")

  if(!user){
   return res.status(404).json({message:"User not found"})
  }

  user.password = password

  await user.save()

  res.json({
   message:"Password updated"
  })

 }
 catch(err){

  res.status(500).json({message:"Server error"})

 }

})

export default router