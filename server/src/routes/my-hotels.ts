import express, { Request, Response } from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth";
import { myHotelsInput } from "../middleware/validateInputFields/validateInput";
import { getAllHotels, getHotelById, myHotels, updateMyHotelById } from "../controllers/myHotels";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// api/my-hotels
router.post("/", verifyToken, myHotelsInput, upload.array("imageFiles", 6), myHotels); // Route for adding a new hotel, accept HTTP POST requests.
router.get("/", verifyToken, getAllHotels);  // Route for retrieving all hotels,  accept HTTP GET requests.
router.get("/:id", verifyToken, getHotelById);
router.put("/:hotelId", verifyToken, upload.array("imageFiles"), updateMyHotelById);

export default router;