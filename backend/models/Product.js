import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    category: String,
    stock: Number,
    brand: String,
    age: String,          // puppy / adult / senior
    image: String,        // URL รูป
    description: String
  },
  {
    timestamps: true   // ⭐ เพิ่ม createdAt และ updatedAt
  }
);

export default mongoose.model("Product", productSchema);