import express from "express"
import User from "../models/User.js"
import generateToken from "../utils/generateToken.js"

const router = express.Router()

router.post("/login", async (req,res)=>{

    const {email,password} = req.body

    const user = await User.findOne({email})

    if(!user){
        return res.status(401).json({message:"Invalid email"})
    }

    //ตรวจ soft deleted
    if(user.isDeleted){
        return res.status(403).json({message:"User account deleted"})
    }

    // 🔹 bcrypt compare
    const isMatch = await user.matchPassword(password)

    if(!isMatch){
        return res.status(401).json({message:"Invalid password"})
    }

    const token = generateToken(res,user._id)

    res.json({
        _id:user._id,
        email:user.email,
        role:user.role,
        token
    })

})

export default router