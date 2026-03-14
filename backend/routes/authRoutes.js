import express from "express"
import { login, logout, register } from "../controllers/authController.js"
import { protect } from "../middleware/protect.js"
import { rateLimit } from "../middleware/rateLimit.js"

const router = express.Router()

router.post("/register", register)
router.post("/login", rateLimit, login)
router.post("/logout", protect, logout)

export default router

