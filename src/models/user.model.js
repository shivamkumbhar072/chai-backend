import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        lowercase:true,
        required:true,
        trim:true,
        index:true,
    },
        email:{
        type:String,
        unique:true,
        lowercase:true,
        required:true,
        trim:true,
    },
        fullName:{
        type:String,
        required:true,
        trim:true,
        index:true
    },
        avatar:{
        type:String, //cloudinary
        unique:true,
        required:true,
    },
        coverImage:{
        type:String,
        unique:true,
    },
        watchHistory:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }],
        password:{
        type:String,
        required:[true,"password is required"],
    },
        refreshToken:{
        type:String,
    },

    
},{timestamps:true})

userSchema.pre("save",async function(next){
    if( ! this.isModified("password")) return next()
    this.password = await bcrypt.hash(this.password,10)
    next()
})

userSchema.methods.isPasswordCorrect = async function (password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function (){
        return jwt.sign(
        {
            _id:this._id,
            email:this.email,
            username:this.username,
            fullName:this.fullName
        },process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function (){
        return jwt.sign(
        {
            _id:this._id,
        },process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_SECRET
        }
    )
}
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("User",userSchema)