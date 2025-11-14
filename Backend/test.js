import sequelize from "./models/index.js";

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected!");
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
})();
