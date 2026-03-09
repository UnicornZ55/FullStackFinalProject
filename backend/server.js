import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"

import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import feedbackRoutes from "./routes/feedbackRoutes.js"
import { rateLimit } from "./middleware/rateLimit.js"

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(rateLimit)

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/feedback", feedbackRoutes)
app.use("/images", express.static("images"));

app.get("/api/health", (req,res)=>{
 res.json({
  uptime:process.uptime(),
  memory:process.memoryUsage(),
  time:new Date()
 })
})

app.get("/",(req,res)=>{
 res.send("PetVerse API running")
})

app.listen(process.env.PORT, ()=>console.log("Server running"))