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

async function testAutoSalePrice() {
  try {
    console.log("\n=== TEST AUTO SALE PRICE (10% DISCOUNT) ===\n");

    // Test với các giá khác nhau
    const testPrices = [
      { original: 30000000, expected: 27000000 },
      { original: 25000000, expected: 22500000 },
      { original: 35000000, expected: 31500000 },
    ];

    testPrices.forEach(test => {
      const calculated = Math.round(test.original * 0.9);
      console.log(`Original: ${test.original.toLocaleString('vi-VN')}đ`);
      console.log(`Expected (10% off): ${test.expected.toLocaleString('vi-VN')}đ`);
      console.log(`Calculated: ${calculated.toLocaleString('vi-VN')}đ`);
      console.log(`✅ ${calculated === test.expected ? 'PASS' : 'FAIL'}\n`);
    });

    console.log("=== CURRENT VARIANTS IN DATABASE ===\n");
    const variants = await sequelize.query(
      `SELECT id, storage, color, original_price, sale_price, 
              ROUND(original_price * 0.9) as expected_sale
       FROM product_variants 
       WHERE product_id = 14
       ORDER BY id`,
      { type: QueryTypes.SELECT }
    );

    variants.forEach((v) => {
      console.log(`ID: ${v.id} - ${v.storage} ${v.color}`);
      console.log(`  Original: ${Number(v.original_price).toLocaleString('vi-VN')}đ`);
      console.log(`  Sale (DB): ${Number(v.sale_price).toLocaleString('vi-VN')}đ`);
      console.log(`  Expected: ${Number(v.expected_sale).toLocaleString('vi-VN')}đ`);
      console.log(`  ${Number(v.sale_price) === Number(v.expected_sale) ? '✅ OK' : '❌ NEEDS UPDATE'}\n`);
    });

    console.log("=== DONE ===\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testAutoSalePrice();
