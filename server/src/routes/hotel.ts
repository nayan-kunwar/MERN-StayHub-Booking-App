import express from "express";
import { createBooking, createPaymentIntent, getHotelById, getHotels, searchHotels } from "../controllers/hotel";
import { param } from "express-validator";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.get("/search", searchHotels);
router.get("/", getHotels); 
router.get("/:id", [param("id").notEmpty().withMessage("Hotel ID is required")], getHotelById); // Put it here else you will get error
router.post("/:hotelId/bookings/payment-intent", verifyToken, createPaymentIntent);
router.post("/:hotelId/bookings", verifyToken, createBooking);

export default router; 