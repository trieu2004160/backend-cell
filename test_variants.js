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

async function testVariants() {
  try {
    // Test if product_variants table exists
    const tableExists = await sequelize.query(
      `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'product_variants'
      );
    `,
      { type: QueryTypes.SELECT }
    );

    console.log("Table exists:", tableExists[0].exists);

    if (tableExists[0].exists) {
      // Check data in product_variants
      const variants = await sequelize.query(
        `
        SELECT * FROM product_variants WHERE product_id = 12;
      `,
        { type: QueryTypes.SELECT }
      );

      console.log("Variants data:", variants);
    } else {
      console.log("Creating product_variants table...");

      await sequelize.query(`
        CREATE TABLE product_variants (
          id SERIAL PRIMARY KEY,
          product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
          storage VARCHAR(50),
          color VARCHAR(50),
          image_url TEXT,
          price DECIMAL(15,2),
          stock_quantity INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `);

      // Insert test data
      await sequelize.query(`
        INSERT INTO product_variants (product_id, storage, color, image_url, price)
        VALUES
        (12, '256GB', 'Đen', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-black_2.png', 32990000),
        (12, '256GB', 'Trắng', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-white_2.png', 32990000),
        (12, '256GB', 'Xám', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png', 32990000),
        (12, '256GB', 'Xanh', 'https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-blue_2.png', 32990000);
      `);

      console.log("Table created and data inserted successfully!");
    }
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

testVariants();
