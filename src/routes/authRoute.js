import {registerUser, verifyEmail } from "../controllers/authController.js";
import express from "express";



const router = express.Router();







router.post("/register",registerUser);
router.get("/verify/:token",verifyEmail);

export default router;