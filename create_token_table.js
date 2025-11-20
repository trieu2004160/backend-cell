require("dotenv").config();
const sequelize = require("./src/configs/database.config");
const Token = require("./src/models/token.model");

async function createTokenTable() {
  try {
    console.log("🔧 Tạo bảng tokens...\n");

    // Kết nối database
    await sequelize.authenticate();
    console.log("✅ Kết nối database thành công!\n");

    // Tạo bảng token
    await Token.sync({ force: false, alter: true });
    console.log("✅ Đã tạo/cập nhật bảng token!\n");

    // Kiểm tra cấu trúc bảng
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'token'
      ORDER BY ordinal_position
    `);

    console.log("📊 Cấu trúc bảng token:");
    columns.forEach((col) => {
      console.log(
        `   - ${col.column_name} (${col.data_type}) ${
          col.is_nullable === "NO" ? "NOT NULL" : "NULL"
        }`
      );
    });

    console.log("\n✅ Hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    console.error(error);
    process.exit(1);
  }
}

createTokenTable();
