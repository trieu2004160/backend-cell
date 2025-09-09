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

async function createProductVariantsTable() {
  try {
    console.log("🔌 Connecting to database...");
    await sequelize.authenticate();
    console.log("✅ Connected successfully!");

    console.log("🏗️ Creating product_variants table...");

    // Create table
    await sequelize.query(
      `
      CREATE TABLE IF NOT EXISTS product_variants (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        group_name VARCHAR(100),
        capacity VARCHAR(50),
        variant_name VARCHAR(100),
        color VARCHAR(50),
        image_url TEXT,
        price DECIMAL(15,2),
        stock_quantity INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `,
      { type: QueryTypes.RAW }
    );

    console.log("✅ Table created!");

    // Check if data exists
    const existingData = await sequelize.query(
      "SELECT COUNT(*) as count FROM product_variants WHERE product_id = 12",
      { type: QueryTypes.SELECT }
    );

    if (existingData[0].count == 0) {
      console.log("📝 Inserting sample data for iPhone 15 Pro Max...");

      await sequelize.query(
        `
        INSERT INTO product_variants (product_id, group_name, capacity, variant_name, color, image_url, price) 
        VALUES 
        (12, 'iPhone 15 Pro Max', '256GB', 'Natural Titanium', 'Đen tự nhiên', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 32990000),
        (12, 'iPhone 15 Pro Max', '256GB', 'Blue Titanium', 'Xanh Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-blue_2.png', 32990000),
        (12, 'iPhone 15 Pro Max', '256GB', 'White Titanium', 'Trắng Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-white_2.png', 32990000),
        (12, 'iPhone 15 Pro Max', '256GB', 'Black Titanium', 'Đen Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 32990000),
        (12, 'iPhone 15 Pro Max', '512GB', 'Natural Titanium', 'Đen tự nhiên', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 36990000),
        (12, 'iPhone 15 Pro Max', '512GB', 'Blue Titanium', 'Xanh Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-blue_2.png', 36990000),
        (12, 'iPhone 15 Pro Max', '512GB', 'White Titanium', 'Trắng Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-white_2.png', 36990000),
        (12, 'iPhone 15 Pro Max', '512GB', 'Black Titanium', 'Đen Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 36990000),
        (12, 'iPhone 15 Pro Max', '1TB', 'Natural Titanium', 'Đen tự nhiên', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 42990000),
        (12, 'iPhone 15 Pro Max', '1TB', 'Blue Titanium', 'Xanh Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-blue_2.png', 42990000),
        (12, 'iPhone 15 Pro Max', '1TB', 'White Titanium', 'Trắng Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-white_2.png', 42990000),
        (12, 'iPhone 15 Pro Max', '1TB', 'Black Titanium', 'Đen Titanium', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 42990000)
      `,
        { type: QueryTypes.INSERT }
      );

      console.log("✅ Sample data inserted!");
    } else {
      console.log("ℹ️ Sample data already exists, skipping insert.");
    }

    // Show inserted data
    const variants = await sequelize.query(
      "SELECT * FROM product_variants WHERE product_id = 12 ORDER BY capacity, variant_name",
      { type: QueryTypes.SELECT }
    );

    console.log("\n📋 Created variants:");
    variants.forEach((v) => {
      console.log(
        `  - ${v.capacity} ${v.variant_name} (${v.color}) - ${Number(
          v.price
        ).toLocaleString()}đ`
      );
    });

    console.log("\n🎉 Setup complete!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

createProductVariantsTable();
