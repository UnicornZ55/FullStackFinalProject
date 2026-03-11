import express from "express"
import { login, logout } from "../controllers/authController.js"
import { protect } from "../middleware/protect.js"
import { rateLimit } from "../middleware/rateLimit.js"

const router = express.Router()

router.post("/login", rateLimit, login)
router.post("/logout", protect, logout)

export default router

