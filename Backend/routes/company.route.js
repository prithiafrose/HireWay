import express from "express";
import { registerCompany, getAllCompanies, getCompanyById, updateCompany } from "../controllers/company.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer();

// REGISTER COMPANY
router.post("/register", isAuthenticated, registerCompany);

// GET ALL COMPANIES
router.get("/", isAuthenticated, getAllCompanies);

// GET COMPANY BY ID
router.get("/:id", isAuthenticated, getCompanyById);

// UPDATE COMPANY
router.put("/:id", isAuthenticated, upload.single("file"), updateCompany);

export default router;
