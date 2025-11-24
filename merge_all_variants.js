const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false,
    }
);

const Product = sequelize.define('Product', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    slug: { type: DataTypes.STRING },
    sale_price: { type: DataTypes.DECIMAL(15, 2) },
    original_price: { type: DataTypes.DECIMAL(15, 2) },
    stock_quantity: { type: DataTypes.INTEGER },
}, { tableName: 'products', timestamps: true, underscored: true });

const ProductVariant = sequelize.define('ProductVariant', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    product_id: { type: DataTypes.BIGINT },
    storage: { type: DataTypes.STRING },
    color: { type: DataTypes.STRING },
    sale_price: { type: DataTypes.DECIMAL(15, 2) },
    original_price: { type: DataTypes.DECIMAL(15, 2) },
    stock_quantity: { type: DataTypes.INTEGER },
    is_active: { type: DataTypes.BOOLEAN },
    is_default: { type: DataTypes.BOOLEAN },
}, { tableName: 'product_variants', timestamps: true, underscored: true });

// Helper to capitalize words
function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

async function mergeAll() {
    const t = await sequelize.transaction();
    try {
        const rawData = fs.readFileSync('duplicate_groups.json');
        const groups = JSON.parse(rawData);

        for (const [baseName, items] of Object.entries(groups)) {
            console.log(`Processing group: ${baseName}`);

            // 1. Pick Parent (shortest name or first)
            // Sort by name length to find the most "generic" name
            items.sort((a, b) => a.name.length - b.name.length);
            const parentInfo = items[0];

            const parentProduct = await Product.findByPk(parentInfo.id, { transaction: t });
            if (!parentProduct) {
                console.error(`Parent product ${parentInfo.id} not found, skipping group.`);
                continue;
            }

            // 2. Update Parent Name
            // Use the baseName from the key, formatted nicely
            // Special case for iPhone: "iphone" -> "iPhone"
            let newName = toTitleCase(baseName);
            if (newName.toLowerCase().startsWith('iphone')) {
                newName = newName.replace('Iphone', 'iPhone');
            }
            // Special case for "samsung galaxy"
            if (newName.toLowerCase().startsWith('samsung galaxy')) {
                // already title cased correctly by helper usually, but ensure S24 etc are capitalized
                // Simple title case might miss "S24" -> "S24"
            }

            console.log(`  Renaming Parent (ID ${parentInfo.id}) to: ${newName}`);
            parentProduct.name = newName;
            // Update slug? Maybe better to keep original or regenerate. 
            // Let's leave slug for now or simple update.
            // parentProduct.slug = ... (skipping slug update to avoid conflicts/complexity for now, or maybe just basic slugify)
            await parentProduct.save({ transaction: t });

            // 3. Process all items (including parent) to create variants
            for (const item of items) {
                const product = await Product.findByPk(item.id, { transaction: t });
                if (!product) continue;

                // Check if variant already exists
                const storage = item.storage || 'Default';
                const existingVariant = await ProductVariant.findOne({
                    where: { product_id: parentInfo.id, storage: storage },
                    transaction: t
                });

                if (!existingVariant) {
                    console.log(`  Creating variant for ${storage} (from ID ${item.id})`);
                    await ProductVariant.create({
                        product_id: parentInfo.id,
                        storage: storage,
                        color: 'Default', // We don't have color info easily available
                        sale_price: product.sale_price,
                        original_price: product.original_price,
                        stock_quantity: product.stock_quantity || 10,
                        is_active: true,
                        is_default: item.id === parentInfo.id // Set parent as default variant
                    }, { transaction: t });
                }

                // 4. Delete child products
                if (item.id !== parentInfo.id) {
                    console.log(`  Deleting child product ID ${item.id}`);
                    await Product.destroy({ where: { id: item.id }, transaction: t });
                }
            }
        }

        await t.commit();
        console.log("All merges completed successfully!");

    } catch (error) {
        await t.rollback();
        console.error("Error merging:", error);
    } finally {
        await sequelize.close();
    }
}

mergeAll();
