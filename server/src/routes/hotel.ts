import express from "express";
import { getHotelById, paymentIntent, searchHotels } from "../controllers/hotel";
import { param } from "express-validator";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/search", searchHotels);
router.get("/:id", [param("id").notEmpty().withMessage("Hotel ID is required")], getHotelById); // Put it here else you will get error
router.post("/:hotelId/bookings/payment-intent", verifyToken, paymentIntent);

export default router;