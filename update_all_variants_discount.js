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

async function updateAllVariantsWithAutoDiscount() {
  try {
    console.log("\n=== UPDATING ALL VARIANTS WITH 10% AUTO DISCOUNT ===\n");

    // Get all variants
    const allVariants = await sequelize.query(
      `SELECT id, product_id, storage, color, original_price, sale_price
       FROM product_variants 
       ORDER BY product_id, id`,
      { type: QueryTypes.SELECT }
    );

    console.log(`Found ${allVariants.length} variants to update\n`);

    // Update each variant with calculated sale_price
    for (const variant of allVariants) {
      const newSalePrice = Math.round(variant.original_price * 0.9);
      
      await sequelize.query(
        `UPDATE product_variants 
         SET sale_price = :salePrice
         WHERE id = :id`,
        {
          replacements: {
            salePrice: newSalePrice,
            id: variant.id
          },
          type: QueryTypes.UPDATE
        }
      );

      console.log(`✅ Updated ID ${variant.id}: ${variant.storage} ${variant.color}`);
      console.log(`   Original: ${Number(variant.original_price).toLocaleString('vi-VN')}đ`);
      console.log(`   Old Sale: ${Number(variant.sale_price).toLocaleString('vi-VN')}đ`);
      console.log(`   New Sale: ${newSalePrice.toLocaleString('vi-VN')}đ (10% off)\n`);
    }

    console.log("\n=== VERIFICATION ===\n");
    
    // Verify updates
    const updated = await sequelize.query(
      `SELECT id, storage, color, original_price, sale_price,
              ROUND(original_price * 0.9) as expected_sale
       FROM product_variants 
       WHERE product_id = 14
       ORDER BY id`,
      { type: QueryTypes.SELECT }
    );

    let allCorrect = true;
    updated.forEach((v) => {
      const isCorrect = Number(v.sale_price) === Number(v.expected_sale);
      console.log(`${v.storage} ${v.color}: ${isCorrect ? '✅' : '❌'}`);
      console.log(`  Sale: ${Number(v.sale_price).toLocaleString('vi-VN')}đ`);
      console.log(`  Expected: ${Number(v.expected_sale).toLocaleString('vi-VN')}đ\n`);
      if (!isCorrect) allCorrect = false;
    });

    console.log(allCorrect ? "🎉 ALL VARIANTS UPDATED SUCCESSFULLY!" : "⚠️ Some variants need attention");
    console.log("\n=== DONE ===\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

updateAllVariantsWithAutoDiscount();
