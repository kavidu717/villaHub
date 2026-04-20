import Booking from "../models/bookingModel.js";
import Villa from "../models/villaModel.js";

export const createBooking=async(req,res)=>{
    try{
        const {villaId,checkInDate,checkOutDate}=req.body

          const checkIn=new Date(checkInDate)
        const checkOut=new Date(checkOutDate)


        const villa=await Villa.findById(villaId)
        if(!villa){
            return res.status(404).json({
                success:false,
                message:"villa not found"
            })
        }

        const existingBooking=await Booking.findOne({
            villa:villaId,
            status:"confirmed",
            $or:[
                {checkInDate:{$lt:checkOut}},
                {checkOutDate:{$gt:checkIn}}
            ]

        })
        
         if(existingBooking){
             return res.status(400).json({
                 success:false,
                 message:"villa is already booked for these dates"
             })
         }
            

      
        
        const timeDiff=checkOut.getTime()-checkIn.getTime()
        const days=Math.ceil(timeDiff/(1000*60*60*24))

        if(days<=0){
            return res.status(400).json({
                success:false,
                message:"check out date must be after check in date"
            })

        }
         const totalPrice=days*villa.pricePerNight

         const booking=await Booking.create({
            villa:villaId,
            user:req.user._id,
            checkInDate,
            checkOutDate,
            days,
            totalPrice,
            status:"confirmed"
         })
         res.status(200).json({
            success:true,
            message:"booking created successfully",
            booking
         })
         
         const savedBooking=await booking.save()
         res.status(200).json({
             success:true,
             message:"booking created successfully",
             booking:savedBooking
             
         })
        
    }
    catch(error){
        res.status(500).
        json(
            {
                message:error.message
            }
        )
    }

}

