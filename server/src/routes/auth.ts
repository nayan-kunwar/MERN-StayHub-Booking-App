import express from "express";
import { validateLoginUser } from "../middleware/validateInputFields/validateInput";
import { loginUser, logoutUser, validateToken } from "../controllers/auth";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

router.post("/login", validateLoginUser, loginUser);
router.post("/logout", logoutUser);
router.get("/validate-token", verifyToken, validateToken);

export default router;