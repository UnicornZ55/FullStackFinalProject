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
  
  discountPercent:{           // ⭐ % ส่วนลด
    type:Number,
    default:0
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

  tags: {
    type: [String],
    default: []
  },

  image: String,

  description: String
},
{
  //function 4.5 C4
  timestamps: true,
  toJSON:{virtuals:true},
  toObject:{virtuals:true}
}
);

productSchema.virtual("salePrice").get(function(){

 if(!this.price) return 0

 return Math.round(
  this.price * (1 - this.discountPercent/100)
 )

})

export default mongoose.model("Product", productSchema);