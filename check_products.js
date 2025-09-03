const sequelize = require("./src/configs/database.config");
const { QueryTypes } = require("sequelize");

async function checkLaptopData() {
  try {
    console.log("🔍 KIỂM TRA DỮ LIỆU LAPTOP TRONG DATABASE\n");

    const products = await sequelize.query(
      `
      SELECT p.id, p.name, c.name as category_name, b.name as brand_name
      FROM products p
      JOIN categories c on c.id = p.category_id
      JOIN brands b on b.id = p.brand_id
      ORDER BY c.name, p.name
    `,
      { type: QueryTypes.SELECT }
    );

    console.log("💻 Tất cả sản phẩm theo category:");
    const groupedProducts = {};
    products.forEach((product) => {
      if (!groupedProducts[product.category_name]) {
        groupedProducts[product.category_name] = [];
      }
      groupedProducts[product.category_name].push(product);
    });

    Object.keys(groupedProducts).forEach((categoryName) => {
      console.log(
        `\n📱 ${categoryName} (${groupedProducts[categoryName].length} sản phẩm):`
      );
      groupedProducts[categoryName].forEach((product) => {
        console.log(`  - ${product.name} (${product.brand_name})`);
      });
    });
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
  } finally {
    process.exit(0);
  }
}

checkLaptopData();
