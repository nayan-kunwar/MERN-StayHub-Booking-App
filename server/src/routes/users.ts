import express from "express";
import { registerUser } from "../controllers/users";
import { validateRegisterInput } from "../middleware/validateRegisterInput";

const router = express.Router();

// User Routes
router.post("/register", validateRegisterInput, registerUser);

export default router;


