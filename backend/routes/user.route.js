import express from "express";
import { login, register, logout, updateProfile } 
from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

router.put("/profile/update", isAuthenticated, updateProfile);

export default router;