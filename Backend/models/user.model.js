import { DataTypes } from "sequelize";
import sequelize from "./index.js";

export const User = sequelize.define("User", {
  fullname: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  phoneNumber: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING, allowNull: false },
  pancard: { type: DataTypes.STRING, unique: true },
  adharcard: { type: DataTypes.STRING, unique: true },
  role: { type: DataTypes.STRING, defaultValue: "user" },
});
