require("dotenv").config();
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: false,
    }
);

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to database.");

        // Get a product to delete (use a high ID to avoid affecting main data if possible, or just try to delete one)
        // Let's try to find a product created recently or just pick one.
        // User mentioned product 12 in previous steps.
        const productId = 12;

        console.log(`Attempting to delete product ID: ${productId}`);

        try {
            await sequelize.query(`DELETE FROM products WHERE id = ${productId}`);
            console.log("✅ Delete successful!");
        } catch (err) {
            console.error("❌ Delete failed:", err.message);
            if (err.original && err.original.detail) {
                console.error("Detail:", err.original.detail);
            }
        }

    } catch (error) {
        console.error("❌ Database error:", error);
    } finally {
        await sequelize.close();
    }
})();
