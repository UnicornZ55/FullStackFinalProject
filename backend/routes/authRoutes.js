import express from "express"
import User from "../models/User.js"

const router = express.Router()

router.post("/login", async (req,res)=>{

 const {email,password} = req.body

 const user = await User.findOne({email})

 if(!user){
  return res.status(401).json({message:"Invalid email"})
 }

 if(user.password !== password){
  return res.status(401).json({message:"Invalid password"})
 }

 res.json({
  _id:user._id,
  email:user.email,
  role:user.role
 })

})

export default router