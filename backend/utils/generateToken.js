import jwt from "jsonwebtoken"

const isProduction = process.env.NODE_ENV === "production"

const generateToken = (res, id) => {

 const token = jwt.sign(
  { id },                         // C4 payload
  process.env.JWT_SECRET,
  { expiresIn: "15m" }            // C3 short expiry
 )

 res.cookie("jwt", token, {
  httpOnly: true,
  secure: isProduction,
  // localhost over HTTP cannot use SameSite=None (requires Secure)
  sameSite: isProduction ? "none" : "lax",
  maxAge: 15 * 60 * 1000,
})

}

export default generateToken