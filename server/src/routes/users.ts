import express from "express";
import { getLoggedInUser, registerUser } from "../controllers/users";
import { validateRegisterInput } from "../middleware/validateInputFields/validateInput";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// User Routes
router.get("/me", verifyToken, getLoggedInUser);
router.post("/register", validateRegisterInput, registerUser);

export default router;


