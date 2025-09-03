const { Sequelize } = require("sequelize");
require("dotenv").config();

async function checkLaptopImages() {
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
    console.log("🔌 Database connected successfully!");

    // 1. Kiểm tra cột image_url có tồn tại không
    console.log("\n📊 CHECKING TABLE STRUCTURE:");
    const [columns] = await sequelize.query(
      "SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'image_url'"
    );

    if (columns.length > 0) {
      console.log("✅ image_url column exists:", columns[0]);
    } else {
      console.log("❌ image_url column does NOT exist");
      console.log("📝 Adding image_url column...");
      await sequelize.query("ALTER TABLE products ADD COLUMN image_url TEXT");
      console.log("✅ image_url column added successfully!");
    }

    // 2. Kiểm tra sản phẩm laptop
    console.log("\n💻 CHECKING LAPTOP PRODUCTS:");
    const [laptops] = await sequelize.query(
      "SELECT id, name, category_id, image_url FROM products WHERE category_id = 11 LIMIT 10"
    );

    console.log(`Found ${laptops.length} laptop products:`);
    laptops.forEach((laptop) => {
      const imageStatus = laptop.image_url ? "✅ HAS IMAGE" : "❌ NO IMAGE";
      console.log(`├── ID: ${laptop.id} | ${laptop.name} | ${imageStatus}`);
      if (laptop.image_url) {
        console.log(`    └── URL: ${laptop.image_url}`);
      }
    });

    // 3. Update một số sản phẩm MacBook với image URL mẫu
    console.log("\n🔄 UPDATING MACBOOK IMAGES:");
    const macbookImages = [
      {
        name: "%MacBook Pro M3 14%",
        url: "https://res.cloudinary.com/df98cpsdv/image/upload/v1/products/macbook-pro-m3-14.jpg",
      },
      {
        name: "%MacBook Air M2%",
        url: "https://res.cloudinary.com/df98cpsdv/image/upload/v1/products/macbook-air-m2.jpg",
      },
      {
        name: "%Dell XPS%",
        url: "https://res.cloudinary.com/df98cpsdv/image/upload/v1/products/dell-xps-13.jpg",
      },
    ];

    for (const image of macbookImages) {
      const [result] = await sequelize.query(
        `UPDATE products SET image_url = '${image.url}' WHERE name ILIKE '${image.name}' AND category_id = 11`
      );
      console.log(
        `✅ Updated products matching '${image.name}': ${
          result.rowCount || 0
        } rows`
      );
    }

    // 4. Kiểm tra lại sau khi update
    console.log("\n📋 FINAL CHECK:");
    const [updatedLaptops] = await sequelize.query(
      "SELECT id, name, image_url FROM products WHERE category_id = 11 AND image_url IS NOT NULL LIMIT 5"
    );

    console.log(`Products with images: ${updatedLaptops.length}`);
    updatedLaptops.forEach((laptop) => {
      console.log(`├── ${laptop.name}`);
      console.log(`    └── ${laptop.image_url}`);
    });
  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    await sequelize.close();
  }
}

checkLaptopImages();
