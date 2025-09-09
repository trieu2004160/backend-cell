const sequelize = require("./src/configs/database.config.js");

async function testRoutes() {
  try {
    console.log("Testing routes...");

    // Test if routes are being loaded
    const adminProductImagesRoute = require("./src/routes/admin.product.images.routes.js");
    console.log("✅ admin.product.images.routes.js loaded");

    // Test main routes file
    const mainRoutes = require("./src/routes/index.js");
    console.log("✅ main routes index.js loaded");

    console.log("\n✅ All routes loaded successfully!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error loading routes:", error.message);
    console.error("Stack:", error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

testRoutes();
