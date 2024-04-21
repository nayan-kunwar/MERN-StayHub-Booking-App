import express from "express";
import { validateLoginUser } from "../middleware/validateRegisterInput";
import { loginUser, validateToken } from "../controllers/auth";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/login", validateLoginUser, loginUser);
router.get("/validate-token", verifyToken, validateToken);

export default router;