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

const updateWithSimpleImages = async () => {
  try {
    console.log("🔄 Updating với hình ảnh đơn giản hơn...");

    // URLs hình ảnh ngắn hơn từ cellphones.com.vn
    const updates = [
      {
        color: "Blue Titanium",
        newUrl:
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-15-pro-max-blue.png",
      },
      {
        color: "White Titanium",
        newUrl:
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-15-pro-max-white.png",
      },
      {
        color: "Black Titanium",
        newUrl:
          "https://cdn2.cellphones.com.vn/x/media/catalog/product/i/p/iphone-15-pro-max-black.png",
      },
    ];

    for (const update of updates) {
      console.log(`\n🎨 Updating ${update.color}...`);

      const result = await sequelize.query(
        `UPDATE product_variants 
         SET image_url = '${update.newUrl}' 
         WHERE color = '${update.color}' AND product_id = 12`,
        { type: QueryTypes.UPDATE }
      );

      console.log(`✅ Updated ${result[1]} variants for ${update.color}`);
      console.log(`   New URL: ${update.newUrl}`);
    }

    console.log("\n🎉 Hoàn thành! Test URLs mới:");

    // Test URLs mới
    for (const update of updates) {
      try {
        const testResult = await fetch(update.newUrl, { method: "HEAD" });
        console.log(
          `${update.color}: ${
            testResult.status === 200 ? "✅ OK" : "❌ Failed"
          } (${testResult.status})`
        );
      } catch (error) {
        console.log(`${update.color}: ❌ Network error`);
      }
    }
  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    process.exit();
  }
};

updateWithSimpleImages();
