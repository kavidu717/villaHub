import express from "express";
import { createBooking, getMyBookings,getAllBookings,getVillaBookings } from "../controllers/bookingController.js";
import { protect, admin } from "../middleware/authMiddleware.js";




const router = express.Router();


router.post("/",protect,createBooking)
router.get("/my-bookings",protect,getMyBookings)

router.get("/all-bookings",protect,admin,
    getAllBookings)

    router.get("/villa/:villaId/bookings", getVillaBookings);











export default router;