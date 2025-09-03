const { Sequelize } = require("sequelize");
require("dotenv").config();

async function restoreCloudinaryImage() {
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

    console.log("\n📝 RESTORE MACBOOK PRO M3 CLOUDINARY IMAGE");
    console.log("==========================================");

    // THAY ĐỔI URL này thành URL Cloudinary thực của bạn
    const YOUR_CLOUDINARY_URL =
      "https://res.cloudinary.com/your_cloud_name/image/upload/v1723456789/macbook-pro-m3-14.jpg";

    console.log(
      "⚠️  IMPORTANT: Please update YOUR_CLOUDINARY_URL in this script"
    );
    console.log("🔗 Current URL to be used:", YOUR_CLOUDINARY_URL);
    console.log("");

    // Uncomment dòng dưới SAU KHI đã cập nhật URL
    // const [result] = await sequelize.query(
    //   `UPDATE products
    //    SET image_url = :imageUrl
    //    WHERE name ILIKE '%MacBook Pro M3%' AND category_id = 11`,
    //   {
    //     replacements: { imageUrl: YOUR_CLOUDINARY_URL }
    //   }
    // );

    // console.log(`✅ Updated MacBook Pro M3: ${result.rowCount || 0} rows`);

    // Test current MacBook Pro M3
    const [currentMacbook] = await sequelize.query(
      `SELECT id, name, image_url 
       FROM products 
       WHERE category_id = 11 AND name ILIKE '%MacBook Pro M3%'`
    );

    if (currentMacbook.length > 0) {
      console.log("📋 CURRENT MACBOOK PRO M3:");
      console.log("==========================");
      console.log(`Name: ${currentMacbook[0].name}`);
      console.log(`Current URL: ${currentMacbook[0].image_url}`);

      if (
        currentMacbook[0].image_url &&
        currentMacbook[0].image_url.includes("cloudinary")
      ) {
        console.log("✅ Already using Cloudinary!");
      } else {
        console.log("⚠️ Not using Cloudinary yet");
        console.log("");
        console.log("📝 TO UPDATE:");
        console.log(
          "1. Edit this script and replace YOUR_CLOUDINARY_URL with your real URL"
        );
        console.log("2. Uncomment the UPDATE query lines");
        console.log("3. Run this script again");
      }
    }
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

console.log("🔄 CLOUDINARY IMAGE RESTORE TOOL");
console.log("================================");
console.log("📝 Tool để khôi phục ảnh Cloudinary cho MacBook Pro M3...");

restoreCloudinaryImage();
