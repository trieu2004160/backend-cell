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
    logging: console.log,
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("=== DATABASE CONNECTED ===");

    // Kiểm tra products có variants
    const products = await sequelize.query(
      `
      SELECT p.id, p.name, p.sale_price 
      FROM products p 
      WHERE EXISTS (SELECT 1 FROM product_variants pv WHERE pv.product_id = p.id)
      LIMIT 5
    `,
      { type: QueryTypes.SELECT }
    );

    console.log("=== PRODUCTS WITH VARIANTS ===");
    console.log(JSON.stringify(products, null, 2));

    // Kiểm tra variants
    const variants = await sequelize.query(
      `
      SELECT pv.*, p.name as product_name 
      FROM product_variants pv 
      JOIN products p ON pv.product_id = p.id 
      LIMIT 10
    `,
      { type: QueryTypes.SELECT }
    );

    console.log("=== PRODUCT VARIANTS ===");
    console.log(JSON.stringify(variants, null, 2));

    // Test query giống như trong repository
    const testProductId = products[0]?.id;
    if (testProductId) {
      console.log(`=== TESTING PRODUCT ID: ${testProductId} ===`);

      const result = await sequelize.query(
        `
        SELECT 
          p.*,
          p.sale_price as price,
          c.name as category_name,
          b.name as brand_name,
          COALESCE(
            JSON_AGG(
              CASE 
                WHEN pv.id IS NOT NULL THEN 
                  JSON_BUILD_OBJECT(
                    'id', pv.id,
                    'storage', pv.storage,
                    'color', pv.color,
                    'image_url', pv.image_url,
                    'price', pv.sale_price,
                    'stock_quantity', pv.stock_quantity,
                    'is_active', pv.is_active
                  )
                ELSE NULL
              END
            ) FILTER (WHERE pv.id IS NOT NULL), 
            '[]'::json
          ) as variants
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        LEFT JOIN brands b ON p.brand_id = b.id
        LEFT JOIN product_variants pv ON p.id = pv.product_id AND pv.is_active = true
        WHERE p.id = $1
        GROUP BY p.id, c.name, b.name
      `,
        { bind: [testProductId], type: QueryTypes.SELECT }
      );

      console.log("=== REPOSITORY QUERY RESULT ===");
      console.log(JSON.stringify(result, null, 2));
    }

    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
})();
