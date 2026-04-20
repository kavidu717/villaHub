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
    noOfGuests:{type:Number
        ,required:true
    },
    totalAmount:{type:Number,
        required:true
    },
    status:{
        type:String,
        enum:["booked","cancelled"],
        default:"booked"},
        



},{timestamps:true})








export default mongoose.model("Booking", bookingSchema);