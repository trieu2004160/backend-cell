require("dotenv").config();
const sequelize = require("./configs/database.config");

// Import all models
const Category = require("./models/category.model");
const Brand = require("./models/brand.model");
const Product = require("./models/product.model");
const ProductImage = require("./models/product_image.model");
const User = require("./models/user.model");
const Token = require("./models/token.model");

async function initDatabase() {
  try {
    console.log("Connecting to database...");
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    console.log("Syncing database...");
    await sequelize.sync({ force: false, alter: true });
    console.log("Database synced successfully!");

    console.log("Database initialization completed!");
    process.exit(0);
  } catch (error) {
    console.error("Database initialization failed:", error);
    process.exit(1);
  }
}

initDatabase();
