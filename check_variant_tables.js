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

        // Check if product_variants table exists
        const [tables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE '%variant%'
      ORDER BY table_name;
    `);

        console.log("📋 Tables related to variants:");
        if (tables.length === 0) {
            console.log("❌ No variant tables found");
        } else {
            tables.forEach(t => console.log(`  - ${t.table_name}`));
        }

        // Check all tables
        const [allTables] = await sequelize.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name;
    `);

        console.log("\n📋 All tables in database:");
        allTables.forEach(t => console.log(`  - ${t.table_name}`));

        await sequelize.close();
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
})();
