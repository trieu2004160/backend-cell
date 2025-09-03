require("dotenv").config();
const sequelize = require("./configs/database.config");
const Category = require("./models/category.model");
const Brand = require("./models/brand.model");
const Product = require("./models/product.model");
const ProductImage = require("./models/product_image.model");

async function seedData() {
  try {
    console.log("Starting data seeding...");

    // Tạo categories mẫu
    const categories = await Category.bulkCreate([
      {
        name: "Smartphone",
        slug: "smartphone",
        description: "Điện thoại thông minh",
        parent_id: null,
        sort_order: 1,
        is_active: true,
      },
      {
        name: "Laptop",
        slug: "laptop",
        description: "Máy tính xách tay",
        parent_id: null,
        sort_order: 2,
        is_active: true,
      },
      {
        name: "Tablet",
        slug: "tablet",
        description: "Máy tính bảng",
        parent_id: null,
        sort_order: 3,
        is_active: true,
      },
    ]);
    console.log("✅ Categories created");

    // Tạo brands mẫu
    const brands = await Brand.bulkCreate([
      {
        name: "iPhone",
        slug: "iphone",
        description: "Apple iPhone",
        sort_order: 1,
        is_active: true,
      },
      {
        name: "Samsung",
        slug: "samsung",
        description: "Samsung Galaxy",
        sort_order: 2,
        is_active: true,
      },
      {
        name: "Xiaomi",
        slug: "xiaomi",
        description: "Xiaomi",
        sort_order: 3,
        is_active: true,
      },
    ]);
    console.log("✅ Brands created");

    console.log("🎉 Data seeding completed successfully!");
    console.log(
      "📝 Note: Only categories and brands created. Products should be added via API or admin panel."
    );
    process.exit(0);
  } catch (error) {
    console.error("❌ Data seeding failed:", error);
    process.exit(1);
  }
}

seedData();
