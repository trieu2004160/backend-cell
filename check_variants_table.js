const { Sequelize, QueryTypes } = require("sequelize");
require("dotenv").config();

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

async function checkVariantsTable() {
  try {
    console.log("🔌 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Connected!");

    // Check if table exists and show structure
    console.log("\n📋 Checking product_variants table structure...");

    const tableInfo = await sequelize.query(
      `
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'product_variants'
      ORDER BY ordinal_position
    `,
      { type: QueryTypes.SELECT }
    );

    if (tableInfo.length > 0) {
      console.log("✅ Table exists with columns:");
      tableInfo.forEach((col) => {
        console.log(
          `  - ${col.column_name}: ${col.data_type} ${
            col.is_nullable === "NO" ? "NOT NULL" : "NULL"
          }`
        );
      });

      // Show existing data
      const data = await sequelize.query(
        "SELECT * FROM product_variants LIMIT 5",
        { type: QueryTypes.SELECT }
      );
      console.log(`\n📊 Sample data (${data.length} rows):`);
      data.forEach((row, i) => {
        console.log(
          `  ${i + 1}. ID: ${row.id}, Product: ${row.product_id}, Storage: ${
            row.storage || "N/A"
          }, Color: ${row.color || "N/A"}`
        );
      });
    } else {
      console.log("❌ Table does not exist");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

checkVariantsTable();
