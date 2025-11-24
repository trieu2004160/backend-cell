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
        console.log("✅ Connection has been established successfully.");

        const [results, metadata] = await sequelize.query("SELECT count(*) FROM products");
        console.log("📊 Product count:", results[0].count);

        if (results[0].count > 0) {
            const [products] = await sequelize.query("SELECT id, name FROM products LIMIT 5");
            console.log("📝 Sample products:", products);
        } else {
            console.log("⚠️ No products found in database!");
        }

    } catch (error) {
        console.error("❌ Unable to connect to the database:", error);
    } finally {
        await sequelize.close();
    }
})();
