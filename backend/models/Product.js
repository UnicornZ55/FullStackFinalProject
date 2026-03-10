import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    unique: true
  },

  price: {
    type: Number,
    required: true,
    min: 0
  },

  category: {
    type: String,
    enum: ["food", "toy", "accessory"],
    required: true
  },

  stock: {
    type: Number,
    min: 0,
    default: 0
  },

  brand: String,

  age: {
    type: String,
    enum: ["puppy", "adult", "senior"]
  },

  image: String,

  description: String
},
{
  timestamps: true
}
);

export default mongoose.model("Product", productSchema);