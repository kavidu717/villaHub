 import mongoose from "mongoose";
 import bcrypt from "bcryptjs"
 import CryptoJS from "crypto-js";


 const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["guest","admin"],
        default:"guest"
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    verifiedToken:{
        type:String
    },
    verifiedTokenExpires:{
        type:Date
    },
    resetPasswordToken:{
        type:String
    },
    resetPasswordTokenExpires:{
        type:Date
    },
    forgotPasswordToken:{
        type:String
    },
    forgotPasswordTokenExpires:{
        type:Date
    },
    

 },{timestamps:true})

 userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
 })

 userSchema.methods.matchPassword=async function(enterpassword){
    return await bcrypt.compare(enterpassword,this.password)
 }

 userSchema.methods.genetrateToken=function(){
    const token=crypto.randomBytes(20).toString("hex")
    const hashToken=crypto.createHash("sha256").update(token).digest("hex")

    if(type==="verify"){
        this.verifiedToken=hashToken
        this.verifiedTokenExpires=Date.now()+24*60*60*1000

    }
    else if(type==="reset"){
        this.resetPasswordToken=hashToken
        this.resetPasswordTokenExpires=Date.now()+24*60*60*1000

    }
    return token;
 }


 export default mongoose.model("User",userSchema)
