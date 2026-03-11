import express from "express"
import { protect } from "../middleware/protect.js"
import { restrictTo } from "../middleware/restrict.js"

const router = express.Router()

// C1 + C2
router.get(
 "/editor-only",
 protect,
 restrictTo("editor"),
 (req,res)=>{
  res.json({
   message:"Editor area",
   user:req.user.role
  })
 }
)

// C3 multiple roles
router.get(
 "/content-zone",
 protect,
 restrictTo("editor","manager"),
 (req,res)=>{
  res.json({
   message:"Content zone",
   role:req.user.role
  })
 }
)

// C5 middleware order test
router.get(
 "/admin-zone",
 protect,
 restrictTo("admin"),
 (req,res)=>{
  res.json({
   message:"Admin zone",
   role:req.user.role
  })
 }
)

export default router