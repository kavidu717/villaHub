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
    console.log("PAYHERE NOTIFY DATA:", req.body);
      console.log("HEADERS:", req.headers);

    const {
      order_id,
      payment_id,
      status_code,
      md5sig,
      amount,
      currency
    } = req.body;

    // 1. Check payment success
    if (status_code !== "2") {
      return res.status(400).send("Payment not successful");
    }

    // 2. Update booking status
    await Booking.findByIdAndUpdate(order_id, {
      status: "confirmed",
      paymentStatus: "paid",
      paymentId: payment_id
    });

    console.log("Booking updated successfully");

    res.status(200).send("OK");
  } catch (error) {
   
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
      path: req.originalUrl,
    });


  }
});

export default router;
