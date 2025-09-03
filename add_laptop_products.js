// const { Sequelize, DataTypes } = require("sequelize");

// // Kết nối database
// const sequelize = new Sequelize("cellphones", "postgres", "12345", {
//   host: "localhost",
//   dialect: "postgresql",
//   logging: false,
// });

// async function addLaptopProducts() {
//   try {
//     // Tạo model Product
//     const Product = sequelize.define(
//       "Product",
//       {
//         name: { type: DataTypes.STRING, allowNull: false },
//         description: { type: DataTypes.TEXT },
//         price: { type: DataTypes.DECIMAL(15, 2) },
//         sale_price: { type: DataTypes.DECIMAL(15, 2) },
//         cost_price: { type: DataTypes.DECIMAL(15, 2) },
//         quantity: { type: DataTypes.INTEGER, defaultValue: 0 },
//         rating_average: { type: DataTypes.DECIMAL(2, 1), defaultValue: 0 },
//         category_id: { type: DataTypes.INTEGER },
//         brand_id: { type: DataTypes.INTEGER, defaultValue: 1 },
//       },
//       {
//         tableName: "products",
//         timestamps: true,
//         createdAt: "created_at",
//         updatedAt: "updated_at",
//       }
//     );

//     await sequelize.authenticate();
//     console.log("✅ Kết nối database thành công!");

//     // Danh sách sản phẩm laptop
//     const laptops = [
//       {
//         name: "MacBook Pro M3 14 inch",
//         description:
//           "MacBook Pro 14 inch với chip M3 mạnh mẽ, màn hình Retina XDR",
//         price: 52990000,
//         sale_price: 49990000,
//         cost_price: 45000000,
//         quantity: 50,
//         rating_average: 4.8,
//         category_id: 11,
//         brand_id: 1,
//       },
//       {
//         name: "MacBook Air M2 13 inch",
//         description: "MacBook Air 13 inch với chip M2, thiết kế mỏng nhẹ",
//         price: 32990000,
//         sale_price: 29990000,
//         cost_price: 27000000,
//         quantity: 30,
//         rating_average: 4.7,
//         category_id: 11,
//         brand_id: 1,
//       },
//       {
//         name: "Dell XPS 13 Plus",
//         description:
//           "Dell XPS 13 Plus với Intel Core i7, màn hình InfinityEdge",
//         price: 45990000,
//         sale_price: 42990000,
//         cost_price: 38000000,
//         quantity: 25,
//         rating_average: 4.6,
//         category_id: 11,
//         brand_id: 2,
//       },
//       {
//         name: "HP Pavilion 15",
//         description: "HP Pavilion 15 inch với AMD Ryzen 7, card đồ họa rời",
//         price: 18990000,
//         sale_price: 16990000,
//         cost_price: 15000000,
//         quantity: 40,
//         rating_average: 4.3,
//         category_id: 11,
//         brand_id: 3,
//       },
//       {
//         name: "ASUS ZenBook 14",
//         description: "ASUS ZenBook 14 inch với Intel Core i5, thiết kế cao cấp",
//         price: 24990000,
//         sale_price: 22990000,
//         cost_price: 20000000,
//         quantity: 35,
//         rating_average: 4.5,
//         category_id: 11,
//         brand_id: 4,
//       },
//       {
//         name: "Lenovo ThinkPad X1 Carbon",
//         description: "Lenovo ThinkPad X1 Carbon Gen 11 với Intel Core i7",
//         price: 48990000,
//         sale_price: 45990000,
//         cost_price: 42000000,
//         quantity: 20,
//         rating_average: 4.7,
//         category_id: 11,
//         brand_id: 5,
//       },
//     ];

//     console.log("🚀 Bắt đầu thêm sản phẩm laptop...\n");

//     for (const laptop of laptops) {
//       try {
//         const [product, created] = await Product.findOrCreate({
//           where: { name: laptop.name },
//           defaults: laptop,
//         });

//         if (created) {
//           console.log(
//             `✅ Đã thêm: ${
//               laptop.name
//             } - Giá: ${laptop.sale_price.toLocaleString("vi-VN")}đ`
//           );
//         } else {
//           console.log(`⚠️  Đã tồn tại: ${laptop.name}`);
//         }
//       } catch (error) {
//         console.error(`❌ Lỗi khi thêm ${laptop.name}:`, error.message);
//       }
//     }

//     console.log("\n🎉 Hoàn tất thêm sản phẩm laptop!");

//     // Kiểm tra tổng số sản phẩm laptop
//     const laptopCount = await Product.count({ where: { category_id: 11 } });
//     console.log(`📊 Tổng số laptop trong database: ${laptopCount} sản phẩm`);

//     await sequelize.close();
//     process.exit(0);
//   } catch (error) {
//     console.error("❌ Lỗi:", error.message);
//     process.exit(1);
//   }
// }

// addLaptopProducts();
