import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";

export const register = async (req, res) => {
  try {
    let { fullname, email, phoneNumber, password, adharcard, pancard, role } = req.body;

    // Trim unwanted spaces
    if (fullname) fullname = fullname.trim();
    if (email) email = email.trim();
    if (adharcard) adharcard = adharcard.trim();
    if (pancard) pancard = pancard.trim();
    if (role) role = role.trim();

    // Validation
    if (!fullname || !email || !phoneNumber || !password || !adharcard || !pancard || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    // Check existing user
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists", success: false });
    }

    // File Upload
    let cloudResponse = null;
    if (req.file) {
      const fileUri = getDataUri(req.file);
      cloudResponse = await cloudinary.uploader.upload(fileUri.content);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullname,
      email,
      phoneNumber,
      password: hashedPassword,
      adharcard,
      pancard,
      role,
      profilePhoto: cloudResponse?.secure_url || null,
    });

    return res.status(201).json({
      message: "User registered successfully",
      success: true,
      user,
    });

  } catch (error) {
    console.error("REGISTER ERROR: ", error.message);
    return res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password || !role) {
      return res.status(400).json({ message: "All fields are required", success: false });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(404).json({ message: "Incorrect email or password", success: false });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect email or password", success: false });

    if (user.role !== role) return res.status(403).json({ message: "Role mismatch", success: false });

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    return res
      .status(200)
      .cookie("token", token, { httpOnly: true, maxAge: 24*60*60*1000, sameSite: "Strict" })
      .json({ message: `Welcome back ${user.fullname}`, user, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGOUT
export const logout = async (req, res) => {
  try {
    return res.status(200).cookie("token", "", { maxAge: 0 }).json({ message: "Logged out successfully", success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    const { fullname, email, phoneNumber, bio, skills } = req.body;
    const file = req.file;
    const userId = req.id;

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "User not found", success: false });

    if (fullname) user.fullname = fullname;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills; // CSV string

    if (file) {
      const fileUri = getDataUri(file);
      const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
      user.resume = cloudResponse.secure_url;
      user.resumeOriginalName = file.originalname;
    }

    await user.save();

    return res.status(200).json({ message: "Profile updated successfully", user, success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
  }
};
