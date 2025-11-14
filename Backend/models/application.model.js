import { DataTypes } from "sequelize";
import sequelize from "./index.js";

export const Application = sequelize.define("Application", {
  status: { type: DataTypes.STRING, defaultValue: "pending" },
});
