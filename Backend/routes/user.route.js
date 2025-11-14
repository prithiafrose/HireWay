import express from "express";
import { register, login, logout, updateProfile } from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.js";
import multer from "multer";

const router = express.Router();
const upload = multer(); // memory storage

// REGISTER
router.post("/register", upload.single("file"), register);



// LOGIN
router.post("/login", login);

// LOGOUT
router.get("/logout", isAuthenticated, logout);

// UPDATE PROFILE
router.put("/profile", isAuthenticated, upload.single("file"), updateProfile);

export default router;
