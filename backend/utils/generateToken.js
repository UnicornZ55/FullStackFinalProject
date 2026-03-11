import jwt from "jsonwebtoken"

const generateToken = (res, id) => {

 const token = jwt.sign(
  { id },                         // C4 payload
  process.env.JWT_SECRET,
  { expiresIn: "15m" }            // C3 short expiry
 )

 res.cookie("jwt", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "none",
  maxAge: 15 * 60 * 1000,
})

}

export default generateToken