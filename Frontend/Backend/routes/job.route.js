import express from "express";
import { postJob, getAllJobs, getJobById, getAdminJobs } from "../controllers/job.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// POST JOB
router.post("/", isAuthenticated, postJob);

// GET ALL JOBS (with optional keyword query)
router.get("/", getAllJobs);

// GET JOB BY ID
router.get("/:id", getJobById);

// GET ADMIN JOBS
router.get("/admin/me", isAuthenticated, getAdminJobs);

export default router;
