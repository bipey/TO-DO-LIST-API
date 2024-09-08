import mongoose from "mongoose";
import bcrypt, { hash } from "bcrypt";
import jwt from "jsonwebtoken";
import "dotenv/config"

const userSchema = new mongoose.Schema({
 firstName:{
    type:String,
    required:true
 },
 lastName:{
    type:String,
    required:true
 },
 email:{
    type:String,
    required:true,
    lowercase:true,
    unique:true
 },
 userName:{
    type:String,
    required:true,
    lowercase:true
 },
 password:{
    type:String,
    required:true,
      minlength:8
 },
 confirmPassword:{
    type:String,
      validate:{
          validator:function(){
              return this.password===this.confirmPassword
          },
          message:"Password and confirm password must be same"
      }  

    
 },
 refreshToken:{
   type:String
 }
})

userSchema.pre("save",async function(next){
    // if(this.password!=this.confirmPassword){
    //     console.error("Password and confirm password must be same")
    // }
  
        
    if(!this.isModified("password")){ //CHECKS IF THE PASSWORD IS MODIFIED OR NOT, ONLY HASHES IF THE PW IS MODIFIED
      return next();
  }
  try {
      this.password=await bcrypt.hash(this.password,8)
  } catch (error) {
      console.log("Error occured while hashing passw0rd")
  }
  this.confirmPassword=undefined
})

userSchema.methods.comparePassword=async function(password){
   return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateTokens=async function(){
   // console.log(process.env.ACCESS_TOKEN_SECRET)
   const accessToken=jwt.sign({_id:this._id},
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      }
   )
   const refreshToken=jwt.sign({_id:this._id},
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn:process.env.REFRESH_TOKEN_EXPIRY
      }
   )
   // console.log(accessToken,"\n",refreshToken)
   return {accessToken,refreshToken}
}
export const User= mongoose.model("User", userSchema)