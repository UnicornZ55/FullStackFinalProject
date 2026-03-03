import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    quantity: Number,
    totalPrice: Number
  },
  { timestamps: true }  // ✔ ถูกต้องแล้ว
);

export default mongoose.model("Order", orderSchema);