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

async function testQuery() {
  try {
    const query = `
      SELECT 
        p.*,
        p.sale_price as price,
        c.name as category_name,
        b.name as brand_name,
        COALESCE(
          JSON_AGG(
            DISTINCT CASE 
              WHEN pi.id IS NOT NULL THEN 
                JSON_BUILD_OBJECT(
                  'id', pi.id,
                  'image_url', pi.image_url,
                  'alt_text', pi.alt_text,
                  'is_primary', pi.is_primary
                )
              ELSE NULL
            END
          ) FILTER (WHERE pi.id IS NOT NULL), 
          '[]'::json
        ) as images,
        COALESCE(
          JSON_AGG(
            DISTINCT CASE 
              WHEN pv.id IS NOT NULL THEN 
                JSON_BUILD_OBJECT(
                  'id', pv.id,
                  'storage', pv.storage,
                  'color', pv.color,
                  'image_url', pv.image_url,
                  'price', pv.price_adjustment,
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
      LEFT JOIN product_images pi ON p.id = pi.product_id
      LEFT JOIN product_variants pv ON p.id = pv.product_id AND pv.is_active = true
      WHERE p.id = $1
      GROUP BY p.id, c.name, b.name
    `;

    const result = await sequelize.query(query, {
      bind: [12],
      type: QueryTypes.SELECT,
    });

    console.log("Query result:", JSON.stringify(result[0], null, 2));
  } catch (error) {
    console.error("Query error:", error);
  } finally {
    await sequelize.close();
  }
}

testQuery();
