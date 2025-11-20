/**
 * Script kiểm tra flow đăng ký và đăng nhập
 * Chạy: node test_auth_flow.js
 */

require("dotenv").config();
const sequelize = require("./src/configs/database.config");
const User = require("./src/models/user.model");
const bcrypt = require("bcryptjs");

const testData = {
  phone: "0123456789",
  email: "test@example.com",
  password: "123456",
  full_name: "Test User",
  date_of_birth: "1990-01-01",
  gender: "male",
};

async function testAuthFlow() {
  try {
    console.log("═══════════════════════════════════════════");
    console.log("🔍 KIỂM TRA HỆ THỐNG ĐĂNG KÝ/ĐĂNG NHẬP");
    console.log("═══════════════════════════════════════════\n");

    // 1. Kiểm tra kết nối database
    console.log("1️⃣ Kiểm tra kết nối database...");
    await sequelize.authenticate();
    console.log("✅ Kết nối database thành công!\n");

    // 2. Kiểm tra table users
    console.log("2️⃣ Kiểm tra bảng users...");
    const [tables] = await sequelize.query(
      "SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename = 'users'"
    );
    if (tables.length === 0) {
      console.log("❌ Bảng users chưa tồn tại!");
      console.log("📝 Đang tạo bảng users...");
      await sequelize.sync({ alter: true });
      console.log("✅ Đã tạo bảng users!\n");
    } else {
      console.log("✅ Bảng users đã tồn tại!\n");
    }

    // 3. Kiểm tra cấu trúc bảng
    console.log("3️⃣ Kiểm tra cấu trúc bảng users...");
    const [columns] = await sequelize.query(`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'users'
      ORDER BY ordinal_position
    `);
    console.log("📊 Các cột trong bảng users:");
    columns.forEach((col) => {
      console.log(
        `   - ${col.column_name} (${col.data_type}) ${
          col.is_nullable === "NO" ? "NOT NULL" : "NULL"
        }`
      );
    });
    console.log("");

    // 4. Xóa user test nếu đã tồn tại
    console.log("4️⃣ Xóa dữ liệu test cũ (nếu có)...");
    await User.destroy({
      where: {
        phone: testData.phone,
      },
    });
    await User.destroy({
      where: {
        email: testData.email,
      },
    });
    console.log("✅ Đã xóa dữ liệu test cũ!\n");

    // 5. Test đăng ký
    console.log("5️⃣ Test đăng ký user mới...");
    const hashedPassword = await bcrypt.hash(testData.password, 10);
    const newUser = await User.create({
      phone: testData.phone,
      email: testData.email,
      password_hash: hashedPassword,
      full_name: testData.full_name,
      date_of_birth: testData.date_of_birth,
      gender: testData.gender,
      status: "active",
    });
    console.log("✅ Đăng ký thành công!");
    console.log("📝 Thông tin user:");
    console.log(`   - ID: ${newUser.id}`);
    console.log(`   - Phone: ${newUser.phone}`);
    console.log(`   - Email: ${newUser.email}`);
    console.log(`   - Full Name: ${newUser.full_name}`);
    console.log(`   - Status: ${newUser.status}\n`);

    // 6. Test đăng nhập
    console.log("6️⃣ Test đăng nhập...");
    const user = await User.findOne({
      where: {
        phone: testData.phone,
      },
    });

    if (!user) {
      console.log("❌ Không tìm thấy user!");
      return;
    }

    const isPasswordValid = await bcrypt.compare(
      testData.password,
      user.password_hash
    );

    if (isPasswordValid) {
      console.log("✅ Đăng nhập thành công!");
      console.log("📝 Thông tin user đăng nhập:");
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Phone: ${user.phone}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Full Name: ${user.full_name}\n`);
    } else {
      console.log("❌ Mật khẩu không đúng!\n");
    }

    // 7. Kiểm tra tổng số users
    console.log("7️⃣ Kiểm tra danh sách users...");
    const allUsers = await User.findAll({
      attributes: ["id", "phone", "email", "full_name", "status"],
      limit: 5,
    });
    console.log(`📊 Tổng số users: ${allUsers.length}`);
    allUsers.forEach((u, index) => {
      console.log(
        `   ${index + 1}. ${u.full_name} (${u.phone || u.email}) - ${u.status}`
      );
    });
    console.log("");

    console.log("═══════════════════════════════════════════");
    console.log("✅ KIỂM TRA HOÀN TẤT!");
    console.log("═══════════════════════════════════════════");
    console.log("\n📝 Dữ liệu test:");
    console.log(`   - Phone: ${testData.phone}`);
    console.log(`   - Email: ${testData.email}`);
    console.log(`   - Password: ${testData.password}`);
    console.log(
      "\n🚀 Bạn có thể dùng thông tin này để test đăng nhập trên frontend!"
    );
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    console.error("Chi tiết:", error);
  } finally {
    await sequelize.close();
    process.exit(0);
  }
}

// Chạy test
testAuthFlow();
