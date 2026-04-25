import Booking from "../models/bookingModel.js";
import Villa from "../models/villaModel.js";

export const createBooking = async (req, res) => {
  try {
    const { villaId, checkInDate, checkOutDate } = req.body;

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    const villa = await Villa.findById(villaId);
    if (!villa) {
      return res.status(404).json({
        success: false,
        message: "Villa not found"
      });
    }

    const existingBooking = await Booking.findOne({
      villa: villaId,
      status: "confirmed",
      $and: [
        { checkInDate: { $lt: checkOut } },
        { checkOutDate: { $gt: checkIn } }
      ]
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "Villa is already booked for these dates"
      });
    }

    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const days = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

    if (days <= 0) {
      return res.status(400).json({
        success: false,
        message: "Check-out date must be after check-in date"
      });
    }

    const totalPrice = days * villa.pricePerNight;

    const booking = await Booking.create({
      villa: villaId,
      user: req.user._id,
      checkInDate,
      checkOutDate,
      days,
      totalPrice,
      status: "pending"
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getMyBookings=async(req,res)=>{
    try{
        const bookings=await Booking.find({user:req.user._id}).populate("villa","name,photos,pricePerNight").sort("-createdAt")
        res.status(200).json({
            success:true,
          
            data:bookings
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

