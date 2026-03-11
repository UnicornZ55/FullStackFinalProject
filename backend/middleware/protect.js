import jwt from "jsonwebtoken"
import User from "../models/User.js"

export const protect = async (req,res,next)=>{

 try{

  let token

  // C1 check token from cookie OR header
  if(req.cookies.jwt){
   token = req.cookies.jwt
  }
  else if(
   req.headers.authorization &&
   req.headers.authorization.startsWith("Bearer")
  ){
   token = req.headers.authorization.split(" ")[1]
  }

  if(!token){
   return res.status(401).json({
    message:"Not authorized, no token"
   })
  }

  // C2 verify JWT
  const decoded = jwt.verify(token, process.env.JWT_SECRET)

  // C1 Ghost user check
  const currentUser = await User.findById(decoded.id)

  if(!currentUser){
   return res.status(401).json({
    message:"User belonging to this token no longer exists"
   })
  }

  // C2 Password change check
  if(currentUser.changedPasswordAfter(decoded.iat)){
   return res.status(401).json({
    message:"User recently changed password"
   })
  }

  // C4 inject user
  req.user = currentUser
  console.log(req.user)
  next()

 }
 catch(err){

  // C5 error handling
  return res.status(401).json({
   message:"Invalid token"
  })

 }

}