// const { Sequelize } = require("sequelize");
// require("dotenv").config();

// async function preserveCloudinaryImages() {
//   const sequelize = new Sequelize(
//     process.env.DB_NAME,
//     process.env.DB_USER,
//     process.env.DB_PASSWORD,
//     {
//       host: process.env.DB_HOST,
//       port: process.env.DB_PORT,
//       dialect: "postgres",
//       logging: false,
//     }
//   );

//   try {
//     await sequelize.authenticate();
//     console.log("🔌 Connected to database!");

//     console.log("\n📝 PRESERVING EXISTING CLOUDINARY IMAGES");
//     console.log("========================================");

//     // Kiểm tra ảnh Cloudinary đã có
//     const [existingCloudinaryImages] = await sequelize.query(
//       `SELECT id, name, image_url
//        FROM products
//        WHERE category_id = 11
//        AND image_url IS NOT NULL
//        AND image_url LIKE '%cloudinary%'
//        ORDER BY id`
//     );

//     console.log(`✅ Found ${existingCloudinaryImages.length} products with Cloudinary images:`);
//     existingCloudinaryImages.forEach(product => {
//       console.log(`   ├── ${product.name}`);
//       console.log(`   └── ${product.image_url.substring(0, 60)}...`);
//     });

//     // Chỉ cập nhật những sản phẩm CHƯA có ảnh hoặc không phải Cloudinary
//     console.log("\n🔄 UPDATING PRODUCTS WITHOUT CLOUDINARY IMAGES");
//     console.log("==============================================");

//     // Sample images chỉ cho products chưa có Cloudinary image
//     const sampleImages = [
//       {
//         name: "%MacBook Air M2%",
//         url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034",
//         condition: "NOT_CLOUDINARY" // Chỉ update nếu chưa có Cloudinary image
//       },
//       {
//         name: "%Dell XPS%",
//         url: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/13-9315/media-gallery/black/notebook-xps-13-9315-black-gallery-2.psd?fmt=pjpg&pscan=auto&scl=1&wid=3491&hei=2623&qlt=100,1&resMode=sharp2&size=3491,2623&chrss=full&imwidth=5000",
//         condition: "NOT_CLOUDINARY"
//       },
//       {
//         name: "%HP Pavilion%",
//         url: "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08047470.png",
//         condition: "NO_IMAGE" // Chỉ update nếu chưa có ảnh gì
//       },
//       {
//         name: "%ASUS ZenBook%",
//         url: "https://dlcdnwebimgs.asus.com/gain/08d2c5d5-d665-4dbb-a4e4-0e6cf6d2e5dc/w800",
//         condition: "NO_IMAGE"
//       }
//     ];

//     for (const image of sampleImages) {
//       console.log(`\n🔄 Processing ${image.name}...`);

//       let updateQuery = "";
//       let replacements = {
//         imageUrl: image.url,
//         namePattern: image.name
//       };

//       if (image.condition === "NOT_CLOUDINARY") {
//         // Chỉ update nếu chưa có ảnh hoặc không phải Cloudinary
//         updateQuery = `UPDATE products
//                        SET image_url = :imageUrl
//                        WHERE name ILIKE :namePattern
//                        AND category_id = 11
//                        AND (image_url IS NULL OR image_url = '' OR image_url NOT LIKE '%cloudinary%')`;
//       } else if (image.condition === "NO_IMAGE") {
//         // Chỉ update nếu hoàn toàn chưa có ảnh
//         updateQuery = `UPDATE products
//                        SET image_url = :imageUrl
//                        WHERE name ILIKE :namePattern
//                        AND category_id = 11
//                        AND (image_url IS NULL OR image_url = '')`;
//       }

//       const [result] = await sequelize.query(updateQuery, { replacements });

//       console.log(`   ├── Updated: ${result.rowCount || 0} rows`);
//       console.log(`   └── Condition: ${image.condition}`);
//     }

//     // QUAN TRỌNG: Không động vào MacBook Pro M3 nếu đã có Cloudinary image
//     console.log("\n🍎 CHECKING MACBOOK PRO M3...");
//     console.log("=============================");

//     const [macbookCheck] = await sequelize.query(
//       `SELECT id, name, image_url
//        FROM products
//        WHERE category_id = 11 AND name ILIKE '%MacBook Pro M3%'`
//     );

//     if (macbookCheck.length > 0) {
//       const macbook = macbookCheck[0];
//       if (macbook.image_url && macbook.image_url.includes('cloudinary')) {
//         console.log(`✅ ${macbook.name} already has Cloudinary image - PRESERVED!`);
//         console.log(`   └── ${macbook.image_url}`);
//       } else {
//         console.log(`⚠️ ${macbook.name} doesn't have Cloudinary image`);
//         console.log(`   └── Current: ${macbook.image_url || 'NO IMAGE'}`);
//         console.log(`   └── Please upload to Cloudinary and update manually`);
//       }
//     }

//     // Kiểm tra kết quả cuối cùng
//     console.log("\n📋 FINAL STATUS:");
//     console.log("================");

//     const [finalCheck] = await sequelize.query(
//       `SELECT
//          COUNT(*) FILTER (WHERE image_url LIKE '%cloudinary%') as cloudinary_count,
//          COUNT(*) FILTER (WHERE image_url IS NOT NULL AND image_url != '' AND image_url NOT LIKE '%cloudinary%') as external_count,
//          COUNT(*) FILTER (WHERE image_url IS NULL OR image_url = '') as no_image_count
//        FROM products
//        WHERE category_id = 11`
//     );

//     const stats = finalCheck[0];
//     console.log(`☁️ Cloudinary images: ${stats.cloudinary_count}`);
//     console.log(`🔗 External images: ${stats.external_count}`);
//     console.log(`❌ No images: ${stats.no_image_count}`);

//   } catch (error) {
//     console.error("❌ Error:", error.message);
//   } finally {
//     await sequelize.close();
//   }
// }

// console.log("🛡️ CLOUDINARY IMAGE PRESERVATION SCRIPT");
// console.log("=======================================");
// console.log("📝 Sẽ bảo tồn ảnh Cloudinary đã có và chỉ bổ sung cho sản phẩm chưa có...");

// preserveCloudinaryImages();
//       {
//         name: "%MacBook Air M2%",
//         url: "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034",
//       },
//       {
//         name: "%Dell XPS%",
//         url: "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/13-9315/media-gallery/black/notebook-xps-13-9315-black-gallery-2.psd?fmt=pjpg&pscan=auto&scl=1&wid=3491&hei=2623&qlt=100,1&resMode=sharp2&size=3491,2623&chrss=full&imwidth=5000",
//       },
//     ];

//     for (const image of sampleImages) {
//       console.log(`\n🔄 Updating ${image.name}...`);

//       const [result] = await sequelize.query(
//         `UPDATE products
//          SET image_url = :imageUrl
//          WHERE name ILIKE :namePattern AND category_id = 11`,
//         {
//           replacements: {
//             imageUrl: image.url,
//             namePattern: image.name,
//           },
//         }
//       );

//       console.log(`✅ Updated: ${result.rowCount || 0} rows`);

//       // Test image URL
//       const axios = require("axios");
//       try {
//         const response = await axios.head(image.url, { timeout: 5000 });
//         console.log(`✅ Image accessible: ${response.status}`);
//       } catch (error) {
//         console.log(`❌ Image test failed: ${error.message}`);
//       }
//     }

//     // Kiểm tra kết quả cuối cùng
//     console.log("\n📋 FINAL LAPTOP IMAGES STATUS:");
//     console.log("==============================");

//     const [laptops] = await sequelize.query(
//       `SELECT id, name, image_url FROM products
//        WHERE category_id = 11 AND image_url IS NOT NULL
//        LIMIT 5`
//     );

//     laptops.forEach((laptop, index) => {
//       console.log(`${index + 1}. ${laptop.name}`);
//       console.log(`   └── ${laptop.image_url.substring(0, 80)}...`);
//     });
//   } catch (error) {
//     console.error("❌ Error:", error.message);
//   } finally {
//     await sequelize.close();
//   }
// }

// console.log("🖼️ LAPTOP SAMPLE IMAGES UPDATER");
// console.log("===============================");
// console.log("📝 Đang cập nhật với ảnh mẫu có thể truy cập...");

// useSampleImages();
