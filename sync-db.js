const sequelize = require("./src/configs/database.config");

async function syncDatabase() {
  try {
    console.log("Syncing database...");
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error syncing database:", error);
    process.exit(1);
  }
}

syncDatabase();
