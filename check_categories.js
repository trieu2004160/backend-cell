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
        console.log("✅ Connected to database.\n");

        const [categories] = await sequelize.query(
            "SELECT id, name, slug FROM categories ORDER BY id"
        );

        console.log("📋 Categories in database:");
        console.log("ID | Name | Slug");
        console.log("---|------|-----");
        categories.forEach(cat => {
            console.log(`${cat.id} | ${cat.name} | ${cat.slug}`);
        });

        await sequelize.close();
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
})();
