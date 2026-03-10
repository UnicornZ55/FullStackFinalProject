import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js"
import morgan from "morgan"
import fs from "fs"
import path from "path"

import authRoutes from "./routes/authRoutes.js"
import productRoutes from "./routes/productRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import feedbackRoutes from "./routes/feedbackRoutes.js"
import { rateLimit } from "./middleware/rateLimit.js"
import { errorHandler } from "./middleware/errorHandler.js"
import externalRoutes from "./routes/externalRoutes.js"
import userRoutes from "./routes/userRoutes.js"

dotenv.config()
connectDB()

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }))
app.use(rateLimit)
app.use(morgan("dev"))

app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/feedback", feedbackRoutes)
app.use("/images", express.static("images"));
app.use("/external", externalRoutes)
app.use("/api/users", userRoutes)

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

app.get("/scan",(req,res)=>{

 const token = req.query.token

 console.log("token:", token)

 if(token === "admin"){
  return res.status(200).json({
   status:"authorized",
   clearance:"high"
  })
 }

 res.status(401).json({
  status:"unauthorized"
 })

})

app.get("/health",(req,res)=>{

    const uptime = process.uptime()

    const memoryMB = process.memoryUsage().rss / 1024 / 1024

    res.json({
        uptime,
        memory_usage_mb: memoryMB.toFixed(2),
        timestamp: new Date().toISOString()
    })

})

app.get("/vault/:filename",(req,res)=>{

    const ua = req.get("User-Agent")

    if(!ua || !ua.includes("PostmanRuntime")){
        return res.status(403).json({error:"Forbidden"})
    }

    const filePath = path.join(process.cwd(),"vault",req.params.filename)

    if(!fs.existsSync(filePath)){
        return res.status(404).json({error:"File not found"})
    }

    res.setHeader("Content-Type","application/octet-stream")

    //function 3.4 C1
    const stream = fs.createReadStream(filePath)

    stream.on("error",()=>{
        res.status(500).json({error:"stream error"})
    })

    stream.pipe(res)

})
app.use(errorHandler)

const PORT = 8080

app.listen(PORT,()=>{
 console.log(`Identity Scanner Server running at http://localhost:${PORT}`)
})