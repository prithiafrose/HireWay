import express from "express";
import { applyJob, getAppliedJobs, getApplicants, updateStatus } from "../controllers/application.controller.js";
import { isAuthenticated } from "../middleware/auth.js";

const router = express.Router();

// APPLY JOB
router.post("/apply/:id", isAuthenticated, applyJob);

// GET MY APPLIED JOBS
router.get("/me", isAuthenticated, getAppliedJobs);

// GET APPLICANTS FOR A JOB
router.get("/applicants/:id", isAuthenticated, getApplicants);

// UPDATE APPLICATION STATUS
router.put("/status/:id", isAuthenticated, updateStatus);

export default router;
