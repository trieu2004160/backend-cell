require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");

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

async function checkLatestVariants() {
  try {
    console.log("\n=== ALL VARIANTS FOR iPHONE 15 PLUS (ID: 14) ===\n");

    const variants = await sequelize.query(
      `SELECT id, storage, color, sale_price, original_price, stock_quantity, image_url, created_at
       FROM product_variants 
       WHERE product_id = 14
       ORDER BY created_at DESC`,
      { type: QueryTypes.SELECT }
    );

    console.log(`Total variants: ${variants.length}\n`);

    variants.forEach((v, index) => {
      console.log(`${index + 1}. ID: ${v.id}`);
      console.log(`   Storage: ${v.storage}`);
      console.log(`   Color: ${v.color}`);
      console.log(
        `   Sale Price: ${Number(v.sale_price).toLocaleString("vi-VN")}đ`
      );
      console.log(
        `   Original Price: ${Number(v.original_price).toLocaleString(
          "vi-VN"
        )}đ`
      );
      console.log(`   Stock: ${v.stock_quantity}`);
      console.log(
        `   Image: ${
          v.image_url ? v.image_url.substring(0, 50) + "..." : "No image"
        }`
      );
      console.log(`   Created: ${v.created_at}`);
      console.log("");
    });

    console.log("=== END ===\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkLatestVariants();
