import express from "express";
import { getHotelById, searchHotels } from "../controllers/hotel";
import { param } from "express-validator";

const router = express.Router();

router.get("/:id", [param("id").notEmpty().withMessage("Hotel ID is required")], getHotelById);
router.get("/search", searchHotels);

export default router;