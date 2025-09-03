const { Sequelize } = require("sequelize");
require("dotenv").config();

async function checkExistingCloudinaryImages() {
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

    console.log("\n📋 CHECKING EXISTING CLOUDINARY IMAGES IN DATABASE");
    console.log("=================================================");

    // Kiểm tra tất cả sản phẩm laptop có image_url từ Cloudinary
    const [laptopsWithImages] = await sequelize.query(
      `SELECT id, name, image_url, created_at, updated_at 
       FROM products 
       WHERE category_id = 11 
       AND image_url IS NOT NULL 
       AND image_url != ''
       ORDER BY updated_at DESC`
    );

    console.log(
      `📊 Found ${laptopsWithImages.length} laptop products with images:`
    );
    console.log("");

    if (laptopsWithImages.length > 0) {
      laptopsWithImages.forEach((laptop, index) => {
        const isCloudinary = laptop.image_url.includes("cloudinary");
        const status = isCloudinary ? "☁️ CLOUDINARY" : "🔗 EXTERNAL";

        console.log(`${index + 1}. ${laptop.name} [${status}]`);
        console.log(`   ├── ID: ${laptop.id}`);
        console.log(`   ├── URL: ${laptop.image_url}`);
        console.log(`   └── Updated: ${laptop.updated_at}`);
        console.log("");
      });
    } else {
      console.log("❌ No images found in database");
    }

    // Kiểm tra MacBook Pro M3 cụ thể
    console.log("\n🎯 MACBOOK PRO M3 SPECIFIC CHECK:");
    console.log("================================");

    const [macbooks] = await sequelize.query(
      `SELECT id, name, image_url 
       FROM products 
       WHERE category_id = 11 AND name ILIKE '%MacBook Pro M3%'`
    );

    if (macbooks.length > 0) {
      macbooks.forEach((macbook) => {
        console.log(`✅ Found: ${macbook.name}`);
        console.log(`   ├── ID: ${macbook.id}`);
        console.log(
          `   └── Current Image: ${macbook.image_url || "❌ NO IMAGE"}`
        );

        if (macbook.image_url && macbook.image_url.includes("cloudinary")) {
          console.log(`   └── ✅ Using Cloudinary image!`);
        } else if (macbook.image_url) {
          console.log(`   └── ⚠️ Using external image (not Cloudinary)`);
        } else {
          console.log(`   └── ❌ No image set`);
        }
        console.log("");
      });
    } else {
      console.log("❌ No MacBook Pro M3 found in database");
    }

    // Đưa ra khuyến nghị
    console.log("\n💡 RECOMMENDATIONS:");
    console.log("===================");

    const cloudinaryCount = laptopsWithImages.filter(
      (item) => item.image_url && item.image_url.includes("cloudinary")
    ).length;

    const externalCount = laptopsWithImages.filter(
      (item) => item.image_url && !item.image_url.includes("cloudinary")
    ).length;

    console.log(`☁️ Products using Cloudinary: ${cloudinaryCount}`);
    console.log(`🔗 Products using external URLs: ${externalCount}`);
    console.log(
      `❌ Products without images: ${
        37 - laptopsWithImages.length
      } (assuming 37 total laptops)`
    );

    if (cloudinaryCount > 0) {
      console.log("\n✅ Great! You have Cloudinary images in database.");
      console.log("📝 The add_sample_images.js script should preserve these.");
    } else {
      console.log("\n⚠️ No Cloudinary images found.");
      console.log("📝 Please upload images to Cloudinary and update database.");
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

console.log("🔍 CHECKING CLOUDINARY IMAGES IN DATABASE");
console.log("=========================================");
console.log("📝 Đang kiểm tra ảnh Cloudinary đã có trong PostgreSQL...");

checkExistingCloudinaryImages();
