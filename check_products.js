const fs = require('fs');
const sequelize = require("./src/configs/database.config");

async function checkProducts() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");

    const [products] = await sequelize.query(`
      SELECT * FROM products 
      WHERE LOWER(name) LIKE '%iphone 14 pro max%'
    `);

    const result = [];

    for (const p of products) {
      const [variants] = await sequelize.query(`
        SELECT * FROM product_variants WHERE product_id = ${p.id}
      `);

      result.push({
        product: p,
        variants: variants
      });
    }

    fs.writeFileSync('products.json', JSON.stringify(result, null, 2));
    console.log("Data written to products.json");

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await sequelize.close();
  }
}

checkProducts();
