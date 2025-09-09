const sequelize = require("./src/configs/database.config.js");

async function runMigration() {
  try {
    console.log("Creating product_images table...");

    // Drop existing table if it has wrong structure
    await sequelize.query("DROP TABLE IF EXISTS product_images CASCADE;");
    console.log("✅ Dropped existing table (if any)");

    // Create new table with correct structure
    const createTableSQL = `
        CREATE TABLE product_images (
            id SERIAL PRIMARY KEY,
            product_id INTEGER NOT NULL,
            image_url VARCHAR(500) NOT NULL,
            variant_capacity VARCHAR(50),
            variant_color VARCHAR(100),
            image_type VARCHAR(20) DEFAULT 'main' CHECK (image_type IN ('main', 'variant')),
            sort_order INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        `;

    await sequelize.query(createTableSQL);
    console.log("✅ Table created successfully!");

    // Create indexes
    console.log("Creating indexes...");
    await sequelize.query(
      "CREATE INDEX idx_product_images_product_id ON product_images(product_id);"
    );
    await sequelize.query(
      "CREATE INDEX idx_product_images_variant ON product_images(variant_capacity, variant_color);"
    );
    await sequelize.query(
      "CREATE INDEX idx_product_images_type ON product_images(image_type);"
    );
    console.log("✅ Indexes created successfully!");

    // Verify table structure
    const [columns] = await sequelize.query(`
            SELECT column_name, data_type, is_nullable 
            FROM information_schema.columns 
            WHERE table_name = 'product_images' 
            ORDER BY ordinal_position;
        `);

    console.log("\nTable structure:");
    columns.forEach((col) => {
      console.log(
        `- ${col.column_name}: ${col.data_type} (${
          col.is_nullable === "YES" ? "nullable" : "not null"
        })`
      );
    });

    console.log("\n✅ Migration completed successfully!");
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Stack:", error.stack);
    await sequelize.close();
    process.exit(1);
  }
}

runMigration();
