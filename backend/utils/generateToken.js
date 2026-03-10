import jwt from "jsonwebtoken"

const generateToken = (res, id) => {

 const token = jwt.sign(
  { userId: id },
  process.env.JWT_SECRET,
  { expiresIn: "7d" }
 )

 res.cookie("jwt", token, {
  httpOnly: true,
  secure: false,
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000
 })

 return token
}

export default generateToken