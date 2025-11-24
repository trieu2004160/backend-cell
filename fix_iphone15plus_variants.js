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

async function fixIphone15PlusVariants() {
  try {
    console.log("\n=== FIXING iPHONE 15 PLUS VARIANTS ===\n");

    // 1. Update giá cho variant "256GB Hồng" (currently null)
    await sequelize.query(
      `UPDATE product_variants 
       SET sale_price = 25990000,
           original_price = 27990000
       WHERE product_id = 14 
       AND storage ILIKE '256GB' 
       AND color ILIKE '%hồng%'
       AND sale_price IS NULL`,
      { type: QueryTypes.UPDATE }
    );
    console.log("✅ Updated price for 256GB Hồng variant");

    // 2. Normalize storage format (128gb, 256gb, 512gb -> 128GB, 256GB, 512GB)
    await sequelize.query(
      `UPDATE product_variants 
       SET storage = 
         CASE 
           WHEN storage ILIKE '%128%' THEN '128GB'
           WHEN storage ILIKE '%256%' THEN '256GB'
           WHEN storage ILIKE '%512%' THEN '512GB'
           WHEN storage ILIKE '%1tb%' THEN '1TB'
           WHEN storage ILIKE '%2tb%' THEN '2TB'
           ELSE storage
         END
       WHERE product_id = 14`,
      { type: QueryTypes.UPDATE }
    );
    console.log("✅ Normalized storage format");

    // 3. Check results
    const variants = await sequelize.query(
      `SELECT id, storage, color, sale_price, original_price, stock_quantity, is_active
       FROM product_variants 
       WHERE product_id = 14
       ORDER BY storage, color`,
      { type: QueryTypes.SELECT }
    );

    console.log("\n📋 Updated variants:");
    variants.forEach((v) => {
      console.log(`  - ${v.storage} ${v.color}:`);
      console.log(`    Sale: ${v.sale_price}đ, Original: ${v.original_price}đ`);
      console.log(`    Stock: ${v.stock_quantity}, Active: ${v.is_active}`);
    });

    console.log("\n=== FIX COMPLETE ===\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

fixIphone15PlusVariants();
