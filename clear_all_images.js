const { Sequelize } = require("sequelize");
require("dotenv").config();

async function clearAllImageUrls() {
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

    console.log("\n📋 BEFORE CLEARING - CURRENT IMAGE STATUS");
    console.log("=========================================");

    // Kiểm tra trước khi xóa
    const [beforeStats] = await sequelize.query(
      `SELECT 
         COUNT(*) FILTER (WHERE image_url LIKE '%cloudinary%') as cloudinary_count,
         COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '' AND image_url NOT LIKE '%cloudinary%') as external_count,
         COUNT(*) FILTER (WHERE image_url IS NULL OR image_url = '') as no_image_count,
         COUNT(*) as total_laptops
       FROM products 
       WHERE category_id = 11`
    );

    const before = beforeStats[0];
    console.log(`☁️ Cloudinary images: ${before.cloudinary_count}`);
    console.log(`🔗 External images: ${before.external_count}`);
    console.log(`❌ No images: ${before.no_image_count}`);
    console.log(`📊 Total laptops: ${before.total_laptops}`);

    // Hiển thị một số ví dụ
    const [sampleProducts] = await sequelize.query(
      `SELECT id, name, image_url 
       FROM products 
       WHERE category_id = 11 AND image_url IS NOT NULL AND image_url != ''
       LIMIT 5`
    );

    console.log("\n🔍 SAMPLE PRODUCTS WITH IMAGES:");
    console.log("==============================");
    sampleProducts.forEach((product, index) => {
      const imageType = product.image_url.includes("cloudinary")
        ? "☁️ CLOUDINARY"
        : "🔗 EXTERNAL";
      console.log(`${index + 1}. ${product.name} [${imageType}]`);
      console.log(`   └── ${product.image_url.substring(0, 60)}...`);
    });

    console.log(
      "\n⚠️  WARNING: This will clear ALL image URLs for laptop products!"
    );
    console.log(
      "📝 After clearing, all products will use fallback images from frontend."
    );
    console.log("");

    // Thực hiện xóa
    console.log("🧹 CLEARING ALL IMAGE URLs...");
    console.log("==============================");

    const [clearResult] = await sequelize.query(
      `UPDATE products 
       SET image_url = NULL 
       WHERE category_id = 11 
       AND (image_url IS NOT NULL AND image_url != '')`
    );

    console.log(
      `✅ Cleared image URLs for ${clearResult.rowCount || 0} products`
    );

    // Kiểm tra sau khi xóa
    console.log("\n📋 AFTER CLEARING - FINAL STATUS");
    console.log("=================================");

    const [afterStats] = await sequelize.query(
      `SELECT 
         COUNT(*) FILTER (WHERE image_url IS NULL OR image_url = '') as no_image_count,
         COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '') as still_has_image,
         COUNT(*) as total_laptops
       FROM products 
       WHERE category_id = 11`
    );

    const after = afterStats[0];
    console.log(`❌ No images (will use fallback): ${after.no_image_count}`);
    console.log(`🔍 Still has images: ${after.still_has_image}`);
    console.log(`📊 Total laptops: ${after.total_laptops}`);

    if (after.still_has_image > 0) {
      console.log("\n⚠️ Some products still have images:");
      const [remaining] = await sequelize.query(
        `SELECT id, name, image_url 
         FROM products 
         WHERE category_id = 11 AND image_url IS NOT NULL AND image_url != ''
         LIMIT 3`
      );

      remaining.forEach((product) => {
        console.log(`   ├── ${product.name}: ${product.image_url}`);
      });
    }

    console.log("\n🎯 FRONTEND BEHAVIOR:");
    console.log("====================");
    console.log("✅ All laptop products will now use the fallback image:");
    console.log(
      "   └── https://cdn2.cellphones.com.vn/insecure/rs:fill:358:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-16-pro-max.png"
    );
    console.log("✅ This ensures consistent display across all products");
    console.log(
      "✅ If you want specific images later, you can upload to Cloudinary and update individual products"
    );
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

console.log("🧹 IMAGE URL CLEANER FOR LAPTOPS");
console.log("=================================");
console.log("📝 Sẽ xóa tất cả URL ảnh của laptop để dùng ảnh mặc định...");
console.log("⚠️  Tất cả sản phẩm laptop sẽ hiển thị ảnh fallback từ frontend");

clearAllImageUrls();
