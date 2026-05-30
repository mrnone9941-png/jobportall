import express from "express";
import { createJob, getAllJobs, getAdminJobs, getJobById } 
from "../controllers/job.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";

const router = express.Router();

router.route("/post").post(isAuthenticated, createJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getAdminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);

export default router;