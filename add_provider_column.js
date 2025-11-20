require("dotenv").config();
const sequelize = require("./src/configs/database.config");

async function addProviderColumn() {
  try {
    console.log("🔧 Thêm cột provider vào bảng users...\n");

    // 1. Tạo ENUM type
    console.log("1️⃣ Tạo ENUM type provider_type...");
    try {
      await sequelize.query(`
        CREATE TYPE provider_type AS ENUM ('local', 'google', 'facebook');
      `);
      console.log("✅ Đã tạo ENUM type provider_type!\n");
    } catch (error) {
      if (error.message.includes("already exists")) {
        console.log("ℹ️ ENUM type provider_type đã tồn tại!\n");
      } else {
        throw error;
      }
    }

    // 2. Thêm cột provider
    console.log("2️⃣ Thêm cột provider...");
    await sequelize.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS provider provider_type DEFAULT 'local';
    `);
    console.log("✅ Đã thêm cột provider!\n");

    // 3. Kiểm tra kết quả
    console.log("3️⃣ Kiểm tra cột provider...");
    const [result] = await sequelize.query(`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'provider';
    `);

    if (result.length > 0) {
      console.log("✅ Cột provider đã được thêm thành công!");
      console.log("📊 Thông tin cột:");
      console.log(`   - Tên: ${result[0].column_name}`);
      console.log(`   - Kiểu: ${result[0].data_type}`);
      console.log(`   - Mặc định: ${result[0].column_default}`);
    } else {
      console.log("❌ Không tìm thấy cột provider!");
    }

    console.log("\n✅ Hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    console.error(error);
    process.exit(1);
  }
}

addProviderColumn();
