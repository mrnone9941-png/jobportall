import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import {
  registerCompany,
  getCompany,
  getCompanyById,
  updateCompany
} from "../controllers/company.controller.js";

const router = express.Router();

router.post("/", isAuthenticated, registerCompany);
router.get("/", isAuthenticated, getCompany);
router.get("/:id", isAuthenticated, getCompanyById);
router.put("/:id", isAuthenticated, updateCompany);

export default router;