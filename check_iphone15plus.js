require("dotenv").config();
const { Sequelize, QueryTypes } = require("sequelize");

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

async function checkIphone15Plus() {
  try {
    console.log("\n=== CHECKING iPHONE 15 PLUS PRODUCTS ===\n");

    // Check products
    const products = await sequelize.query(
      `SELECT id, name, slug FROM products 
       WHERE name LIKE '%iPhone 15 Plus%' OR slug LIKE '%15-plus%' OR slug LIKE '%15plus%'
       ORDER BY id`,
      { type: QueryTypes.SELECT }
    );

    console.log("📱 Found products:", products.length);
    products.forEach((p) => {
      console.log(`  - ID: ${p.id}, Name: ${p.name}, Slug: ${p.slug}`);
    });

    // Check variants for each product
    for (const product of products) {
      console.log(`\n🔧 Variants for ${product.name} (ID: ${product.id}):`);
      const variants = await sequelize.query(
        `SELECT id, storage, color, sale_price, stock_quantity, is_active, image_url
         FROM product_variants 
         WHERE product_id = :productId
         ORDER BY storage, color`,
        {
          replacements: { productId: product.id },
          type: QueryTypes.SELECT,
        }
      );

      if (variants.length === 0) {
        console.log("  ❌ No variants found!");
      } else {
        variants.forEach((v) => {
          console.log(
            `  - ${v.storage} ${v.color}: ${v.sale_price}đ (Stock: ${v.stock_quantity}, Active: ${v.is_active})`
          );
          if (v.image_url) {
            console.log(`    Image: ${v.image_url.substring(0, 60)}...`);
          }
        });
      }
    }

    console.log("\n=== CHECK COMPLETE ===\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

checkIphone15Plus();
