const sequelize = require("./src/configs/database.config");
const ProductVariant = require("./src/models/variant.model");

async function fixVariantPrices() {
    try {
        console.log("Starting variant price fix...");

        // Update 128GB Variant (ID 43)
        // Price: 27,990,000, Stock: 30
        await ProductVariant.update(
            {
                sale_price: 27990000,
                original_price: 29990000,
                stock_quantity: 30
            },
            { where: { storage: '128GB', product_id: 16 } }
        );
        console.log("Updated 128GB variant price and stock.");

        // Update 256GB Variant (ID 42)
        // Price: 30,990,000 (Estimated logic), Stock: 6 (Keep existing)
        await ProductVariant.update(
            {
                sale_price: 30990000,
                original_price: 32990000
            },
            { where: { storage: '256GB', product_id: 16 } }
        );
        console.log("Updated 256GB variant price.");

    } catch (error) {
        console.error("Error fixing variant prices:", error);
    } finally {
        await sequelize.close();
    }
}

fixVariantPrices();
