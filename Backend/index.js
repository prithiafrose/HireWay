import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import sequelize from "./models/index.js";

import { User } from "./models/user.model.js";
import { Company } from "./models/company.model.js";
import { Job } from "./models/job.model.js";
import { Application } from "./models/application.model.js";

// Import routes
import userRoute from "./routes/user.route.js";

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

// Associations
User.hasMany(Application, { foreignKey: "applicantId" });
Application.belongsTo(User, { foreignKey: "applicantId" });

Company.hasMany(Job, { foreignKey: "companyId" });
Job.belongsTo(Company, { foreignKey: "companyId" });

Job.hasMany(Application, { foreignKey: "jobId" });
Application.belongsTo(Job, { foreignKey: "jobId" });

// Routes
app.use("/api/user", userRoute);

// Test route
app.get("/", (req, res) => {
  res.send("Job Portal API Running...");
});

// Sync tables & start server
sequelize.sync({ force: true }) // drop & create tables
  .then(() => {
    console.log("✅ All tables created successfully!");
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at: http://localhost:${PORT}/`);
      console.log(`🔗 Try API: http://localhost:${PORT}/api/user/register`);
    });
  })
  .catch(err => console.error("❌ DB Sync error:", err));
