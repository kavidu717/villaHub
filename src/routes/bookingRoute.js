import express from "express";
import { createBooking, getMyBookings,getAllBookings } from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";




const router = express.Router();


router.post("/",protect,createBooking)
router.get("/my-bookings",protect,getMyBookings)

router.get("/all-bookings",protect,admin,getAllBookings)











export default router;