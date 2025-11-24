require("dotenv").config();
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: "postgres",
        logging: console.log,
    }
);

const missingColumns = [
    { name: "dimensions", type: "VARCHAR(100)" },
    { name: "weight", type: "DECIMAL(8, 2)" },
    { name: "warranty_period", type: "INTEGER DEFAULT 12" },
    { name: "is_featured", type: "BOOLEAN DEFAULT false" },
    { name: "status", type: "VARCHAR(20) DEFAULT 'active'" }, // ENUM might be tricky, using VARCHAR for safety or check if type exists
    { name: "rating_average", type: "DECIMAL(3, 2) DEFAULT 0" },
    { name: "rating_count", type: "INTEGER DEFAULT 0" },
    { name: "meta_title", type: "VARCHAR(255)" },
    { name: "meta_description", type: "TEXT" },
    { name: "short_description", type: "TEXT" },
    { name: "description", type: "TEXT" },
    { name: "image_url", type: "VARCHAR(255)" },
];

(async () => {
    try {
        await sequelize.authenticate();
        console.log("✅ Connected to database.");

        const queryInterface = sequelize.getQueryInterface();
        const tableDescription = await queryInterface.describeTable("products");

        console.log("📊 Current columns:", Object.keys(tableDescription));

        for (const col of missingColumns) {
            if (!tableDescription[col.name]) {
                console.log(`⚠️ Column '${col.name}' is missing. Adding it...`);
                try {
                    // Handle status enum specifically if needed, but for now let's try adding as column
                    // If it's an enum in postgres, we might need to create the type first or just use varchar
                    if (col.name === 'status') {
                        // Check if we can just add it. If it fails, it might be due to enum type.
                        // For simplicity in this fix script, let's try adding it as VARCHAR first if it doesn't exist.
                        // But wait, the model defines it as ENUM.
                        // Let's try to add it using raw query to be safe with types
                        await sequelize.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};`);
                    } else {
                        await sequelize.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS ${col.name} ${col.type};`);
                    }
                    console.log(`✅ Added column '${col.name}'.`);
                } catch (err) {
                    console.error(`❌ Failed to add column '${col.name}':`, err.message);
                }
            } else {
                console.log(`✓ Column '${col.name}' exists.`);
            }
        }

        console.log("🎉 Schema check completed.");

    } catch (error) {
        console.error("❌ Database error:", error);
    } finally {
        await sequelize.close();
    }
})();
