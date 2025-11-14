import { DataTypes } from "sequelize";
import sequelize from "./index.js";
import { Company } from "./company.model.js";

export const Job = sequelize.define("Job", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  salary: { type: DataTypes.STRING },
});

// Association with Company will be set in server.js
