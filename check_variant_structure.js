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

        // Check product_variants structure
        const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'product_variants'
      ORDER BY ordinal_position;
    `);

        console.log("📋 product_variants table structure:");
        console.log("Column Name | Data Type | Nullable | Default");
        console.log("------------|-----------|----------|--------");
        columns.forEach(col => {
            const def = col.column_default ? col.column_default.substring(0, 20) : '';
            console.log(`${col.column_name} | ${col.data_type} | ${col.is_nullable} | ${def}`);
        });

        // Check if there are any variants
        const [variants] = await sequelize.query(`
      SELECT COUNT(*) as count FROM product_variants;
    `);

        console.log(`\n📦 Total variants in database: ${variants[0].count}`);

        // Sample variants
        if (variants[0].count > 0) {
            const [sample] = await sequelize.query(`
        SELECT pv.*, p.name as product_name
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        LIMIT 3;
      `);

            console.log("\n📦 Sample variants:");
            console.log(JSON.stringify(sample, null, 2));
        }

        await sequelize.close();
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
})();
