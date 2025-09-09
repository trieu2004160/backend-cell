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

const cleanAllProductImages = async () => {
  try {
    console.log("🧹 Cleaning product images cho iPhone 15 Pro Max...");

    // 1. Xóa tất cả hình từ product_images table cho product_id = 12
    console.log("\n📋 Xóa từ product_images table...");
    const deleteFromImages = await sequelize.query(
      `DELETE FROM product_images WHERE product_id = 12`,
      { type: QueryTypes.DELETE }
    );
    console.log(`✅ Đã xóa images từ product_images table`);

    // 2. Reset tất cả variants về hình chính (Natural Titanium)
    console.log("\n📋 Reset tất cả variants về hình chính...");
    const mainImageUrl =
      "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max_3.png";

    const updateVariants = await sequelize.query(
      `UPDATE product_variants 
       SET image_url = '${mainImageUrl}' 
       WHERE product_id = 12`,
      { type: QueryTypes.UPDATE }
    );
    console.log(`✅ Đã reset tất cả variants về hình chính`);

    // 3. Kiểm tra kết quả
    console.log("\n📋 Kiểm tra kết quả...");
    const variants = await sequelize.query(
      `SELECT id, storage, color, image_url FROM product_variants WHERE product_id = 12`,
      { type: QueryTypes.SELECT }
    );

    console.log(
      `📊 Hiện có ${variants.length} variants, tất cả dùng hình chính`
    );

    const images = await sequelize.query(
      `SELECT COUNT(*) as count FROM product_images WHERE product_id = 12`,
      { type: QueryTypes.SELECT }
    );
    console.log(
      `📊 Product images table: ${images[0].count} images (đã clean)`
    );

    console.log("\n🎉 Hoàn thành! Giờ chỉ có hình chính từ variants.");
    console.log(
      "👍 Bạn có thể thêm hình mới qua admin panel vào product_images table."
    );
  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    process.exit();
  }
};

cleanAllProductImages();
