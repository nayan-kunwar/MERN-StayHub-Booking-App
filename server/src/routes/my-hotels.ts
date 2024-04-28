import express, { Request, Response } from "express";
import multer from "multer";
import { verifyToken } from "../middleware/auth";
import { myHotelsInput } from "../middleware/validateInputFields/validateInput";
import { getAllHotels, myHotels } from "../controllers/myHotels";
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB
    }
});

// api/my-hotels
router.post("/", verifyToken, myHotelsInput, upload.array("imageFiles", 6), myHotels);
router.get("/", verifyToken, getAllHotels);

export default router;