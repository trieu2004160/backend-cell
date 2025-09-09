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

const updateBrokenImages = async () => {
  try {
    console.log("🔍 Tìm các hình ảnh bị lỗi...");

    // Tìm tất cả variants có hình ảnh bị lỗi
    const brokenImages = [
      "iphone-15-pro-max-blue_2.png",
      "iphone-15-pro-max-white_2.png",
      "iphone-15-pro-max-black_2.png",
    ];

    for (const brokenImg of brokenImages) {
      console.log(`\n🔧 Xử lý hình ảnh: ${brokenImg}`);

      // Tìm variants có hình này
      const variants = await sequelize.query(
        `SELECT id, product_id, color, storage, image_url 
         FROM product_variants 
         WHERE image_url LIKE '%${brokenImg}%'`,
        { type: QueryTypes.SELECT }
      );

      console.log(`📋 Tìm thấy ${variants.length} variants có hình này:`);
      variants.forEach((v) => {
        console.log(
          `   - ID: ${v.id}, Color: ${v.color}, Storage: ${v.storage}`
        );
      });

      if (variants.length > 0) {
        // Tạo URL hình mới dựa vào màu sắc
        let newImageUrl = "";
        if (brokenImg.includes("blue")) {
          newImageUrl =
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-xanh-duong.png";
        } else if (brokenImg.includes("white")) {
          newImageUrl =
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-trang.png";
        } else if (brokenImg.includes("black")) {
          newImageUrl =
            "https://cdn2.cellphones.com.vn/insecure/rs:fill:0:358/q:90/plain/https://cellphones.com.vn/media/catalog/product/i/p/iphone-15-pro-max-den.png";
        }

        if (newImageUrl) {
          console.log(`✅ Cập nhật thành: ${newImageUrl}`);

          const updateResult = await sequelize.query(
            `UPDATE product_variants 
             SET image_url = '${newImageUrl}' 
             WHERE image_url LIKE '%${brokenImg}%'`,
            { type: QueryTypes.UPDATE }
          );

          console.log(`✅ Đã cập nhật ${updateResult[1]} records`);
        } else {
          console.log(`❌ Không tìm thấy hình thay thế cho ${brokenImg}`);
        }
      }
    }

    console.log("\n🎉 Hoàn thành cập nhật hình ảnh!");
  } catch (error) {
    console.error("❌ Lỗi:", error);
  } finally {
    process.exit();
  }
};

updateBrokenImages();
