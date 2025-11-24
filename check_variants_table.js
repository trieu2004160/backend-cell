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

    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'product_variants'
      ORDER BY ordinal_position;
    `);

    console.log("📋 product_variants table columns:");
    console.log("Column Name | Data Type | Nullable");
    console.log("------------|-----------|----------");
    columns.forEach(col => {
      console.log(`${col.column_name} | ${col.data_type} | ${col.is_nullable}`);
    });

    await sequelize.close();
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();
