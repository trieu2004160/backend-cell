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
    logging: console.log,
  }
);

async function updateVariantPrices() {
  try {
    console.log("🔌 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Connected!");

    console.log("💰 Updating variant prices...");

    // Update prices for iPhone 15 Pro Max variants
    await sequelize.query(
      `
      UPDATE product_variants 
      SET sale_price = 32990000
      WHERE product_id = 12 AND storage = '256GB'
    `,
      { type: QueryTypes.UPDATE }
    );

    // Add more capacity variants
    const existingVariants = await sequelize.query(
      "SELECT COUNT(*) as count FROM product_variants WHERE product_id = 12 AND storage != '256GB'",
      { type: QueryTypes.SELECT }
    );

    if (existingVariants[0].count == 0) {
      console.log("📝 Adding more capacity variants...");

      await sequelize.query(
        `
        INSERT INTO product_variants 
        (product_id, storage, color, image_url, sale_price, stock_quantity, is_active) 
        VALUES 
        (12, '512GB', 'Natural Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 36990000, 10, true),
        (12, '512GB', 'Blue Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-blue_2.png', 36990000, 10, true),
        (12, '512GB', 'White Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-white_2.png', 36990000, 10, true),
        (12, '512GB', 'Black Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 36990000, 10, true),
        (12, '1TB', 'Natural Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 42990000, 5, true),
        (12, '1TB', 'Blue Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-blue_2.png', 42990000, 5, true),
        (12, '1TB', 'White Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-white_2.png', 42990000, 5, true),
        (12, '1TB', 'Black Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 42990000, 5, true)
      `,
        { type: QueryTypes.INSERT }
      );

      console.log("✅ Added additional variants!");
    }

    // Show final data
    const allVariants = await sequelize.query(
      `
      SELECT storage, color, sale_price, stock_quantity
      FROM product_variants 
      WHERE product_id = 12 
      ORDER BY storage, color
    `,
      { type: QueryTypes.SELECT }
    );

    console.log("\n📋 Final variants:");
    allVariants.forEach((v) => {
      console.log(
        `  - ${v.storage} ${v.color} - ${Number(
          v.sale_price
        ).toLocaleString()}đ (stock: ${v.stock_quantity})`
      );
    });

    console.log("\n🎉 Update complete!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

updateVariantPrices();
