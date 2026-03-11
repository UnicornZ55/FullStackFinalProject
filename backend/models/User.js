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
    enum:["user","admin","editor","manager"],
    default:"user"
  },

  isDeleted:{
    type:Boolean,
    default:false
  },

  deletedAt:{
    type:Date,
    default:null
  },
  passwordChangedAt:{
    type:Date
  }

},
{
  timestamps:true
}
)


// ✅ C1 + C3 + C4
userSchema.pre("save", async function(){

  // prevent double hashing
  if(!this.isModified("password")) return 

  this.password = await bcrypt.hash(this.password,12)

  this.passwordChangedAt = Date.now() - 1000
  
})


// ใช้ตอน login
userSchema.methods.matchPassword = async function(enteredPassword){

  return await bcrypt.compare(enteredPassword,this.password)

}


userSchema.methods.changedPasswordAfter = function(JWTTimestamp){

 if(this.passwordChangedAt){
  //Function 5.3 C3
  const changedTimestamp = parseInt(
   this.passwordChangedAt.getTime() / 1000,
   10
  )

  return JWTTimestamp < changedTimestamp
 }

 return false
}

export default mongoose.model("User",userSchema)