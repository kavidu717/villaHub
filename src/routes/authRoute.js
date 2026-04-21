import {registerUser, verifyEmail, loginUser, getAllUsers, toggleBlockUser, deleteUser, getMyProfile, updateMyProfile } from "../controllers/authController.js";
import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";


const router = express.Router();







router.post("/register",registerUser);
router.get("/verify/:token",verifyEmail);
router.post("/login",loginUser);
router.get("/profile",protect,getMyProfile);
router.put("/profile",protect,updateMyProfile);


router.get("/admin/all",protect ,admin,getAllUsers);
router.patch("/admin/block/:id",protect,admin,toggleBlockUser);
router.delete("/admin/:id",deleteUser);



export default router;