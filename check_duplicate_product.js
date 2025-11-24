require("dotenv").config();
require("./src/configs/database.config");
const Product = require("./src/models/product.model");

async function checkDuplicates() {
  try {
    const slug = "16prm";
    const sku = "16prm512";
    const name = "iPhone 16 Pro Max 512GB ";

    console.log("\n=== CHECKING FOR DUPLICATES ===\n");

    const existingSlug = await Product.findOne({ where: { slug } });
    if (existingSlug) {
      console.log("❌ Slug '16prm' already exists:");
      console.log("  - ID:", existingSlug.id);
      console.log("  - Name:", existingSlug.name);
      console.log("  - Slug:", existingSlug.slug);
      console.log("  - SKU:", existingSlug.sku);
    } else {
      console.log("✅ Slug '16prm' is available");
    }

    const existingSku = await Product.findOne({ where: { sku } });
    if (existingSku) {
      console.log("\n❌ SKU '16prm512' already exists:");
      console.log("  - ID:", existingSku.id);
      console.log("  - Name:", existingSku.name);
      console.log("  - Slug:", existingSku.slug);
      console.log("  - SKU:", existingSku.sku);
    } else {
      console.log("\n✅ SKU '16prm512' is available");
    }

    const existingName = await Product.findOne({ where: { name } });
    if (existingName) {
      console.log("\n❌ Name 'iPhone 16 Pro Max 512GB ' already exists:");
      console.log("  - ID:", existingName.id);
      console.log("  - Name:", existingName.name);
      console.log("  - Slug:", existingName.slug);
      console.log("  - SKU:", existingName.sku);
    } else {
      console.log("\n✅ Name 'iPhone 16 Pro Max 512GB ' is available");
    }

    console.log("\n=== CHECK COMPLETE ===\n");
    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

checkDuplicates();
