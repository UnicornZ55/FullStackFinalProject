import express from "express"
import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"

const router = express.Router()

router.post("/login", async (req,res)=>{

 try{

  const {email,password} = req.body

  // 🔹 ต้อง select password
  const user = await User
   .findOne({email})
   .select("+password")

  if(!user){
   return res.status(401).json({
    message:"Invalid email or password"
   })
  }

  // soft delete check
  if(user.isDeleted){
   return res.status(403).json({
    message:"User account deleted"
   })
  }

  const isMatch = await user.matchPassword(password)

  if(!isMatch){
   return res.status(401).json({
    message:"Invalid email or password"
   })
  }

  // generate cookie token
  generateToken(res,user._id)

  res.json({
   _id:user._id,
   email:user.email,
   role:user.role
  })

 }
 catch(err){

  res.status(500).json({message:"Server error"})

 }

})

export default router