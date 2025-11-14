import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized", success: false });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) return res.status(401).json({ message: "Unauthorized", success: false });

    req.user = user;
    req.id = user.id; // shortcut for controllers
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized", success: false });
  }
};
