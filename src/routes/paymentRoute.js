import express from "express";
import crypto from "crypto";
import Booking from "../models/bookingModel.js";

import dotenv from "dotenv";
dotenv.config();


const router = express.Router();

router.post("/payhere", (req, res) => {
  const { orderId, amount } = req.body;

  
  console.log("MERCHANT_ID:", process.env.PAYMENT_MERCHANT_ID);
  console.log("MERCHANT_SECRET:", process.env.PAYMENT_MERCHANT_SECRET);


  const merchantId = process.env.PAYMENT_MERCHANT_ID;
  const merchantSecret = process.env.PAYMENT_MERCHANT_SECRET;

  const hashedSecret = crypto
    .createHash("md5")
    .update(merchantSecret)
    .digest("hex")
    .toUpperCase();

  const amountFormatted = parseFloat(amount).toFixed(2);

  const hash = crypto
    .createHash("md5")
    .update(
      merchantId +
        orderId +
        amountFormatted +
        "LKR" +
        hashedSecret
    )
    .digest("hex")
    .toUpperCase();

  res.json({ hash });
});


router.post("/notify", async (req, res) => {
  try {
    console.log("🔥 NOTIFY HIT");
    console.log("PAYHERE DATA:", req.body);

    const {
      order_id,
      payment_id,
      status_code,
    } = req.body;

    // 1. Validate input
    if (!order_id) {
      console.log("❌ Missing order_id");
      return res.status(400).send("Invalid order");
    }

    // 2. Check payment success
    if (status_code !== "2") {
      console.log("❌ Payment not successful");
      return res.status(400).send("Payment failed");
    }

    // 3. Update booking
    const updated = await Booking.findByIdAndUpdate(
      order_id,
      {
        status: "confirmed",
        paymentStatus: "paid",
        paymentId: payment_id,
      },
      { new: true }
    );

    // 4. Check result
    if (!updated) {
      console.log("❌ Booking NOT FOUND:", order_id);
      return res.status(404).send("Booking not found");
    }

    console.log("✅ Booking updated:", updated._id);

    return res.status(200).send("OK");

  } catch (error) {
    console.log("❌ ERROR:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
});

export default router;
