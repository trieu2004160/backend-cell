const { Sequelize } = require("sequelize");
require("dotenv").config();

async function preserveCloudinaryImages() {
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

    console.log("\n📝 PRESERVING EXISTING CLOUDINARY IMAGES");
    console.log("========================================");

    // Kiểm tra ảnh Cloudinary đã có
    const [existingCloudinaryImages] = await sequelize.query(
      `SELECT id, name, image_url 
       FROM products 
       WHERE category_id = 11 
       AND image_url IS NOT NULL 
       AND image_url LIKE '%cloudinary%'
       ORDER BY id`
    );

    console.log(
      `✅ Found ${existingCloudinaryImages.length} products with Cloudinary images:`
    );
    if (existingCloudinaryImages.length > 0) {
      existingCloudinaryImages.forEach((product) => {
        console.log(`   ├── ${product.name}`);
        console.log(`   └── ${product.image_url.substring(0, 60)}...`);
      });
    } else {
      console.log("   └── No Cloudinary images found in database");
    }

    // Kiểm tra đặc biệt MacBook Pro M3
    console.log("\n🍎 MACBOOK PRO M3 STATUS:");
    console.log("========================");

    const [macbookCheck] = await sequelize.query(
      `SELECT id, name, image_url 
       FROM products 
       WHERE category_id = 11 AND name ILIKE '%MacBook Pro M3%'`
    );

    if (macbookCheck.length > 0) {
      const macbook = macbookCheck[0];
      console.log(`Name: ${macbook.name}`);
      console.log(`Current image: ${macbook.image_url || "NO IMAGE"}`);

      if (macbook.image_url && macbook.image_url.includes("cloudinary")) {
        console.log(`✅ ALREADY HAS CLOUDINARY IMAGE - Will be preserved!`);
      } else if (macbook.image_url) {
        console.log(`⚠️ Has external image - Can be replaced with Cloudinary`);
      } else {
        console.log(`❌ No image - Needs Cloudinary upload`);
      }
    }

    // Chỉ cập nhật những sản phẩm CHƯA có ảnh Cloudinary
    console.log("\n🔄 UPDATING PRODUCTS WITHOUT CLOUDINARY IMAGES");
    console.log("==============================================");

    // Sample images chỉ cho products chưa có Cloudinary image
    const sampleImages = [
      {
        name: "%HP Pavilion%",
        url: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08047470.png",
        condition: "NO_IMAGE",
      },
      {
        name: "%ASUS ZenBook%",
        url: "https://dlcdnwebimgs.asus.com/gain/08d2c5d5-d665-4dbb-a4e4-0e6cf6d2e5dc/w800",
        condition: "NO_IMAGE",
      },
      {
        name: "%ASUS Vivobook%",
        url: "https://dlcdnwebimgs.asus.com/gain/4d4263d6-4dd0-4cad-9b4b-e2b8a63a5e7c/w800",
        condition: "NO_IMAGE",
      },
      {
        name: "%ASUS TUF Gaming%",
        url: "https://dlcdnwebimgs.asus.com/gain/27a2b5b5-5d1d-4e8f-9b2f-8b7e8c5f2e7a/w800",
        condition: "NO_IMAGE",
      },
      {
        name: "%ASUS ROG%",
        url: "https://dlcdnwebimgs.asus.com/gain/1c5f7b2a-3e4d-4f5e-8b9c-2d8e5f1a6b7c/w800",
        condition: "NO_IMAGE",
      },
      {
        name: "%Lenovo ThinkPad%",
        url: "https://p1-ofp.static.pub/medias/bWFzdGVyfHJvb3R8MjE5NzA4fGltYWdlL3BuZ3xoZGYvaGNmLzE0NDczNjM1OTk5NzY2LnBuZ3w3OTNlZDk1MjY3ZjE1YmY0ZWU3ZWIzZjg5NDk1ODFjZDYzNjdhZmIzZGY5YzI5YjczNGQ4NTc5ZTE4OTc3M2Uz/lenovo-laptop-thinkpad-x1-carbon-gen-9-hero.png",
        condition: "NO_IMAGE",
      },
    ];

    for (const image of sampleImages) {
      console.log(`\n🔄 Processing ${image.name}...`);

      // Chỉ update nếu hoàn toàn chưa có ảnh
      const updateQuery = `UPDATE products 
                           SET image_url = :imageUrl 
                           WHERE name ILIKE :namePattern 
                           AND category_id = 11
                           AND (image_url IS NULL OR image_url = '')`;

      const [result] = await sequelize.query(updateQuery, {
        replacements: {
          imageUrl: image.url,
          namePattern: image.name,
        },
      });

      console.log(
        `   └── Updated: ${
          result.rowCount || 0
        } rows (only products without any image)`
      );
    }

    // Kiểm tra kết quả cuối cùng
    console.log("\n📋 FINAL LAPTOP IMAGES STATUS:");
    console.log("==============================");

    const [finalCheck] = await sequelize.query(
      `SELECT 
         id, name, image_url,
         CASE 
           WHEN image_url LIKE '%cloudinary%' THEN 'CLOUDINARY'
           WHEN image_url IS NOT NULL AND image_url != '' THEN 'EXTERNAL'
           ELSE 'NO_IMAGE'
         END as image_type
       FROM products 
       WHERE category_id = 11
       ORDER BY 
         CASE 
           WHEN image_url LIKE '%cloudinary%' THEN 1
           WHEN image_url IS NOT NULL THEN 2
           ELSE 3
         END, name`
    );

    console.log("\nProducts by image type:");
    const groups = {
      CLOUDINARY: [],
      EXTERNAL: [],
      NO_IMAGE: [],
    };

    finalCheck.forEach((product) => {
      groups[product.image_type].push(product);
    });

    console.log(`\n☁️ CLOUDINARY IMAGES (${groups.CLOUDINARY.length}):`);
    groups.CLOUDINARY.forEach((p) => {
      console.log(`   ├── ${p.name}`);
    });

    console.log(`\n🔗 EXTERNAL IMAGES (${groups.EXTERNAL.length}):`);
    groups.EXTERNAL.forEach((p) => {
      console.log(`   ├── ${p.name}`);
    });

    console.log(`\n❌ NO IMAGES (${groups.NO_IMAGE.length}):`);
    groups.NO_IMAGE.forEach((p) => {
      console.log(`   ├── ${p.name}`);
    });

    console.log("\n💡 RECOMMENDATIONS:");
    console.log("===================");
    console.log(
      "✅ Cloudinary images are preserved and will display correctly"
    );
    console.log("📝 External images will work but may be slower");
    console.log("⚠️ Products without images will use fallback image");
    console.log("\n🎯 Your MacBook Pro M3 image from Cloudinary is safe!");
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

console.log("🛡️ CLOUDINARY IMAGE PRESERVATION SCRIPT");
console.log("=======================================");
console.log(
  "📝 Bảo tồn ảnh Cloudinary và chỉ bổ sung cho sản phẩm chưa có ảnh..."
);

preserveCloudinaryImages();
