import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloud.js";
import { Op } from "sequelize";

// REGISTER
export const register = async (req, res) => {
  try {
    let { fullname, email, phoneNumber, password, adharcard, pancard, role } = req.body;
    const file = req.file; // optional file

    if (email) email = email.trim();
    if (adharcard) adharcard = adharcard.trim();
    if (pancard) pancard = pancard.trim();
    if (fullname) fullname = fullname.trim();
    if (role) role = role.trim();

    // Required fields check (without file)
    if (!fullname || !email || !phoneNumber || !password || !role || !adharcard || !pancard) {
      return res.status(400).json({ message: "All fields are required (except profile photo)", success: false });
    }

    // Check existing user
    const existingUser = await User.findOne({
      where: { [Op.or]: [{ email }, { adharcard }, { pancard }] }
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email/Adhar/Pan already exists", success: false });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Optional: Cloudinary upload
    let profilePhotoUrl = null;
    if (file) {
      try {
        const fileUri = getDataUri(file);
        const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
        profilePhotoUrl = cloudResponse.secure_url;
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        // continue without breaking registration
      }
    }

    // Create user
    const newUser = await User.create({
      fullname,
      email,
      phoneNumber,
      adharcard,
      pancard,
      password: hashedPassword,
      role,
      profilePhoto: profilePhotoUrl,
    });

    return res.status(201).json({ message: `Account created for ${fullname}`, success: true, user: newUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", success: false });
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
