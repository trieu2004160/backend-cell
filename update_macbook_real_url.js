const { Sequelize } = require("sequelize");
require("dotenv").config();

async function updateRealImageUrls() {
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

  try {
    await sequelize.authenticate();
    console.log("🔌 Connected to database!");

    console.log("\n📝 UPDATING MACBOOK PRO M3 WITH REAL CLOUDINARY URL");
    console.log("==================================================");

    // Sử dụng URL thực mà bạn đã upload lên Cloudinary
    const realImageUrl =
      "https://res.cloudinary.com/ten_cloud/image/upload/v1723456789/abc123.jpg"; // URL thực từ Cloudinary của bạn

    const [result] = await sequelize.query(
      `UPDATE products 
       SET image_url = :imageUrl 
       WHERE name ILIKE '%MacBook Pro M3 14%' AND category_id = 11`,
      {
        replacements: { imageUrl: realImageUrl },
      }
    );

    console.log(`✅ Updated MacBook Pro M3: ${result.rowCount || 0} rows`);
    console.log(`🔗 New URL: ${realImageUrl}`);

    // Kiểm tra kết quả
    const [updatedProduct] = await sequelize.query(
      `SELECT id, name, image_url FROM products WHERE name ILIKE '%MacBook Pro M3 14%' AND category_id = 11`
    );

    if (updatedProduct.length > 0) {
      console.log("\n📋 UPDATED PRODUCT:");
      console.log("==================");
      updatedProduct.forEach((product) => {
        console.log(`Name: ${product.name}`);
        console.log(`Image URL: ${product.image_url}`);
      });
    }

    console.log("\n🧪 TESTING IMAGE URL...");
    console.log("======================");

    // Test image URL
    const axios = require("axios");
    try {
      const response = await axios.head(realImageUrl);
      console.log(`✅ Image URL accessible: ${response.status}`);
      console.log(`📦 Content-Type: ${response.headers["content-type"]}`);
    } catch (error) {
      console.log(`❌ Image URL not accessible: ${error.message}`);
      console.log("💡 Vui lòng kiểm tra lại URL từ Cloudinary dashboard");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

console.log("🍎 MACBOOK PRO M3 IMAGE URL UPDATER");
console.log("===================================");
console.log("📝 Đang cập nhật URL ảnh thực từ Cloudinary...");
console.log("💡 Nếu URL không đúng, vui lòng sửa trong script này");

updateRealImageUrls();
