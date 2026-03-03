import jwt from "jsonwebtoken"

const generateToken = (res,id)=>{
 const token = jwt.sign({userId:id}, process.env.JWT_SECRET)
 res.cookie("jwt", token, { httpOnly:true })
}

export default generateToken