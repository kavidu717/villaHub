import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    
    villa:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Villa",
        required:true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    checkInDate:{
        
        type:Date,required:true
    },
    checkOutDate:{
        type:Date
        ,required:true
    },
    
    totalPrice:{type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["pending","confirmed","cancelled"],
        default:"pending"},




},{timestamps:true})








export default mongoose.model("Booking", bookingSchema);
