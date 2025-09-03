const fs = require("fs");
require("dotenv").config();

console.log("🔍 KIỂM TRA TÍNH NĂNG UPLOAD CLOUDINARY");
console.log("=========================================");

// 1. Kiểm tra cấu hình môi trường
console.log("\n📋 1. KIỂM TRA BIẾN MÔI TRƯỜNG:");
console.log("├── CLOUD_NAME:", process.env.CLOUD_NAME ? "✅" : "❌ MISSING");
console.log("├── API_KEY:", process.env.API_KEY ? "✅" : "❌ MISSING");
console.log(
  "├── API_SECRET:",
  process.env.API_SECRET &&
    process.env.API_SECRET !== "YOUR_CLOUDINARY_API_SECRET_HERE"
    ? "✅"
    : "❌ MISSING/INCOMPLETE"
);

// 2. Kiểm tra các file cần thiết
console.log("\n📁 2. KIỂM TRA CÁC FILE CẦN THIẾT:");
const requiredFiles = [
  "src/configs/cloudinary.config.js",
  "src/controllers/upload.controller.js",
  "src/routes/upload.route.js",
];

requiredFiles.forEach((file) => {
  const exists = fs.existsSync(file);
  console.log(`├── ${file}:`, exists ? "✅" : "❌ MISSING");
});

// 3. Kiểm tra dependencies
console.log("\n📦 3. KIỂM TRA DEPENDENCIES:");
try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const deps = packageJson.dependencies || {};

  const requiredDeps = ["cloudinary", "multer", "multer-storage-cloudinary"];
  requiredDeps.forEach((dep) => {
    console.log(`├── ${dep}:`, deps[dep] ? `✅ ${deps[dep]}` : "❌ MISSING");
  });
} catch (e) {
  console.log("❌ Cannot read package.json");
}

// 4. Kiểm tra cấu trúc upload route
console.log("\n🛤️ 4. KIỂM TRA ĐĂNG KÝ ROUTE:");
try {
  const indexRoutes = fs.readFileSync("src/routes/index.js", "utf8");
  const hasUploadRoute =
    indexRoutes.includes("uploadRoute") && indexRoutes.includes("/upload");
  console.log(
    "├── Upload route registered:",
    hasUploadRoute ? "✅" : "❌ NOT REGISTERED"
  );
} catch (e) {
  console.log("❌ Cannot read routes/index.js");
}

// 5. Kết luận
console.log("\n📊 5. KẾT LUẬN:");
const cloudinaryConfigured =
  process.env.CLOUD_NAME &&
  process.env.API_KEY &&
  process.env.API_SECRET &&
  process.env.API_SECRET !== "YOUR_CLOUDINARY_API_SECRET_HERE";

if (cloudinaryConfigured) {
  console.log("✅ Cấu hình Cloudinary hoàn tất - Có thể test upload");
  console.log("🚀 Endpoint: POST http://localhost:3000/api/upload");
  console.log("📤 Field name: file (multipart/form-data)");
} else {
  console.log("❌ Chưa hoàn thiện - Cần cập nhật API_SECRET trong .env file");
  console.log(
    "📝 Vui lòng cập nhật CLOUD_NAME, API_KEY, API_SECRET từ Cloudinary Dashboard"
  );
}

console.log("\n🔗 Hướng dẫn lấy credentials:");
console.log("1. Truy cập: https://cloudinary.com/console");
console.log("2. Tạo tài khoản hoặc đăng nhập");
console.log("3. Copy CLOUD_NAME, API_KEY, API_SECRET từ Dashboard");
console.log("4. Cập nhật vào file .env");
