const sequelize = require("./src/configs/database.config");
const Product = require("./src/models/product.model");
const ProductVariant = require("./src/models/variant.model");

async function fixVariants() {
    const t = await sequelize.transaction();

    try {
        console.log("Starting variant fix...");

        // 1. Identify the main product (ID 16: "iPhone 14 Pro Max 128GB")
        const mainProduct = await Product.findByPk(16, { transaction: t });
        if (!mainProduct) throw new Error("Main product (ID 16) not found");
        console.log("Found main product:", mainProduct.name);

        // 2. Create a new Variant for 128GB linked to Product 16
        // Check if it already exists to avoid duplicates
        const existing128 = await ProductVariant.findOne({
            where: { product_id: 16, storage: '128GB' },
            transaction: t
        });

        if (!existing128) {
            console.log("Creating 128GB variant...");
            await ProductVariant.create({
                product_id: 16,
                storage: '128GB',
                color: 'Deep Purple', // Default color from image or description
                price: mainProduct.sale_price,
                original_price: mainProduct.original_price,
                stock_quantity: mainProduct.stock_quantity,
                is_active: true,
                is_default: true
            }, { transaction: t });
        } else {
            console.log("128GB variant already exists.");
        }

        // 3. Identify the "orphan" variant (ID 42: 256GB) currently linked to Product 250
        const variant256 = await ProductVariant.findByPk(42, { transaction: t });
        if (variant256) {
            console.log("Found 256GB variant (ID 42). Moving to Product 16...");
            variant256.product_id = 16;
            variant256.storage = '256GB'; // Ensure storage is set correctly
            await variant256.save({ transaction: t });
        } else {
            console.log("Variant 256GB (ID 42) not found. Checking if Product 250 has other variants...");
            // Fallback: Check if there are ANY variants for product 250
            const variants250 = await ProductVariant.findAll({ where: { product_id: 250 }, transaction: t });
            for (const v of variants250) {
                console.log(`Moving variant ${v.id} (${v.storage}) to Product 16...`);
                v.product_id = 16;
                await v.save({ transaction: t });
            }
        }

        // 4. Rename Product 16 to "iPhone 14 Pro Max"
        console.log("Renaming main product...");
        mainProduct.name = "iPhone 14 Pro Max";
        mainProduct.slug = "iphone-14-pro-max"; // Update slug to be generic
        await mainProduct.save({ transaction: t });

        // 5. Delete the now-empty Product 250 and Product 189
        console.log("Deleting duplicate products...");
        await Product.destroy({ where: { id: [250, 189] }, transaction: t });

        await t.commit();
        console.log("Fix completed successfully!");

    } catch (error) {
        await t.rollback();
        console.error("Error fixing variants:", error);
    } finally {
        await sequelize.close();
    }
}

fixVariants();
