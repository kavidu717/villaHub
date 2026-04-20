import {registerUser, verifyEmail, loginUser } from "../controllers/authController.js";
import express from "express";



const router = express.Router();







router.post("/register",registerUser);
router.get("/verify/:token",verifyEmail);
router.post("/login",loginUser);

export default router;