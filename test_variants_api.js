const { Sequelize, QueryTypes } = require("sequelize");
require("dotenv").config();

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

async function testVariantsAPI() {
  try {
    console.log("🔌 Testing product variants APIs...");
    await sequelize.authenticate();
    console.log("✅ Database connected!");

    // Test 1: Lấy variants theo product ID
    console.log("\n🧪 Test 1: Get variants by product ID = 12");
    const variants = await sequelize.query(
      `
      SELECT 
        pv.id,
        pv.color as variant_name,
        pv.storage as capacity,
        pv.sale_price as price,
        pv.image_url,
        pv.stock_quantity
      FROM product_variants pv
      WHERE pv.product_id = 12
      AND pv.is_active = true
      ORDER BY pv.storage, pv.id
    `,
      { type: QueryTypes.SELECT }
    );

    console.log(`✅ Found ${variants.length} variants:`);
    variants.forEach((v) => {
      console.log(
        `  - ${v.capacity} ${v.variant_name} - ${Number(
          v.price || 0
        ).toLocaleString()}đ`
      );
    });

    // Test 2: Lấy capacity duy nhất
    console.log("\n🧪 Test 2: Get unique capacities for iPhone 15 Pro Max");
    const capacities = await sequelize.query(
      `
      SELECT DISTINCT pv.storage as capacity
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      WHERE p.name LIKE '%iPhone 15 Pro Max%' 
      AND pv.is_active = true
      ORDER BY capacity
    `,
      { type: QueryTypes.SELECT }
    );

    console.log(`✅ Found ${capacities.length} capacities:`);
    capacities.forEach((c) => {
      console.log(`  - ${c.capacity}`);
    });

    // Test 3: Lấy variants theo capacity
    if (capacities.length > 0) {
      const firstCapacity = capacities[0].capacity;
      console.log(`\n🧪 Test 3: Get variants for capacity = ${firstCapacity}`);

      const variantsByCapacity = await sequelize.query(
        `
        SELECT 
          pv.id,
          pv.color as variant_name,
          pv.storage as capacity,
          pv.sale_price as price,
          pv.image_url,
          pv.stock_quantity
        FROM product_variants pv
        JOIN products p ON pv.product_id = p.id
        WHERE p.name LIKE '%iPhone 15 Pro Max%' 
        AND pv.storage = :capacity
        AND pv.is_active = true
        ORDER BY pv.id
      `,
        {
          replacements: { capacity: firstCapacity },
          type: QueryTypes.SELECT,
        }
      );

      console.log(
        `✅ Found ${variantsByCapacity.length} variants for ${firstCapacity}:`
      );
      variantsByCapacity.forEach((v) => {
        console.log(
          `  - ${v.variant_name} - ${Number(v.price || 0).toLocaleString()}đ`
        );
      });
    }

    console.log("\n🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await sequelize.close();
  }
}

testVariantsAPI();
