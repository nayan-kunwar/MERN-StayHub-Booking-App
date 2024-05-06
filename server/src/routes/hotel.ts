import express from "express";
import { getHotelById, searchHotels } from "../controllers/hotel";
import { param } from "express-validator";

const router = express.Router();

router.get("/search", searchHotels);
router.get("/:id", [param("id").notEmpty().withMessage("Hotel ID is required")], getHotelById); // Put it here else you will get error

export default router;