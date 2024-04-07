import express from "express";
import { validateLoginUser } from "../middleware/validateRegisterInput";
import { loginUser } from "../controllers/auth";

const router = express.Router();

router.post("/login", validateLoginUser, loginUser);

export default router;