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

        // Check products table structure
        const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'products'
      ORDER BY ordinal_position;
    `);

        console.log("📋 Products table columns:");
        console.log("Column Name | Data Type | Nullable");
        console.log("------------|-----------|----------");
        columns.forEach(col => {
            console.log(`${col.column_name} | ${col.data_type} | ${col.is_nullable}`);
        });

        // Check if category_id exists
        const hasCategoryId = columns.some(col => col.column_name === 'category_id');
        console.log(`\n${hasCategoryId ? '✅' : '❌'} category_id field exists: ${hasCategoryId}`);

        // Check sample products
        const [products] = await sequelize.query(`
      SELECT id, name, category_id, brand_id
      FROM products
      LIMIT 5;
    `);

        console.log("\n📦 Sample products:");
        console.log(JSON.stringify(products, null, 2));

        await sequelize.close();
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
})();
