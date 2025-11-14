import { DataTypes } from "sequelize";
import sequelize from "./index.js";

export const Company = sequelize.define("Company", {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  phoneNumber: { type: DataTypes.STRING },
});
