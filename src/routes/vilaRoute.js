import express from "express";
import { createVilla, getVillas, getVillaById } from "../controllers/villaController.js";
import { protect, admin } from "../middleware/authMiddleware.js";



const router = express.Router();

// this is public route

router.get("/",getVillas)
router.get("/:id",getVillaById)


// this is protected route
router.post("/",protect,admin,createVilla)









export default router;










