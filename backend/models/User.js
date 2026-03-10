import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
{
  username:{
    type:String,
    required:true
  },

  email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true   // ✅ C5 normalize email
  },

  password:{
    type:String,
    required:true,
    minlength:5,
    select:false     // ✅ C2 hide password
  },

  role:{
    type:String,
    enum:["user","admin"],
    default:"user"
  },

  isDeleted:{
    type:Boolean,
    default:false
  },

  deletedAt:{
    type:Date,
    default:null
  }

},
{
  timestamps:true
}
)


// ✅ C1 + C3 + C4
userSchema.pre("save", async function(next){

  // prevent double hashing
  if(!this.isModified("password")) return next()

  this.password = await bcrypt.hash(this.password,12)

  next()
})


// ใช้ตอน login
userSchema.methods.matchPassword = async function(enteredPassword){

  return await bcrypt.compare(enteredPassword,this.password)

}

export default mongoose.model("User",userSchema)