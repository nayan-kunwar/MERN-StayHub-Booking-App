import express, { Request, Response } from "express";
import { verifyToken } from "../middleware/auth";
import { myBookings } from "../controllers/my-bookings";

const router = express.Router();

// /api/my-bookings
router.get("/", verifyToken, myBookings);

export default router;