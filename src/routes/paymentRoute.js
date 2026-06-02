import express from "express";
import Stripe from "stripe";
import Booking from "../models/bookingModel.js";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Stripe Checkout Session
router.post("/stripe", async (req, res) => {
  try {
    const { orderId, amount } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "lkr",
            product_data: {
              name: `Villa Booking #${orderId}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],

      // Pass booking ID to success page
      success_url: `http://localhost:5173/success?bookingId=${orderId}`,
      cancel_url: "http://localhost:5173/cancel",
    });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    console.log("Stripe Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update booking after successful payment
router.put("/booking/:id/paid", async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      {
        status: "confirmed",
      },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;