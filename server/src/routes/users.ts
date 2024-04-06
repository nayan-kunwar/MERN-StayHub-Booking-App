import express from "express";
import { Router } from "express";
import { registerUser } from "../controllers/users";

const router = express.Router();

// User Routes
router.post("/register", registerUser);

export default router; 