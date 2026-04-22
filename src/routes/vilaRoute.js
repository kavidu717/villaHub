import express from "express";
import { createVilla, getVillas, getVillaById, updateVilla, deleteVilla } from "../controllers/villaController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";



const router = express.Router();

// this is public route

router.get("/",getVillas)
router.get("/:id",getVillaById)




// this is protected route
router.post("/",protect,admin,upload.array("photos", 10),createVilla)
router.put("/:id",protect,admin,updateVilla)
router.delete("/:id",protect,admin,deleteVilla)









export default router;








