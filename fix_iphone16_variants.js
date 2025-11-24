const { Sequelize, DataTypes } = require('sequelize');
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

async function fixVariants() {
    const t = await sequelize.transaction();
    try {
        // 1. Identify the main product (ID 248)
        const mainProduct = await Product.findByPk(248, { transaction: t });
        if (!mainProduct) throw new Error("Main product (ID 248) not found");
        console.log("Found main product:", mainProduct.name);

        // 2. Create a 256GB Variant for Product 248 (since it has none)
        // Check if it already exists to avoid duplicates
        const existing256 = await ProductVariant.findOne({
            where: { product_id: 248, storage: '256GB' },
            transaction: t
        });

        if (!existing256) {
            console.log("Creating 256GB variant for Product 248...");
            await ProductVariant.create({
                product_id: 248,
                storage: '256GB',
                color: 'Titan Black', // Default color
                sale_price: mainProduct.sale_price,
                original_price: mainProduct.original_price,
                stock_quantity: 10, // Default stock
                is_active: true,
                is_default: true
            }, { transaction: t });
        }

        // 3. Move the 512GB variant from Product 251 to Product 248
        // The variant ID is 44 based on the JSON output
        const variant512 = await ProductVariant.findByPk(44, { transaction: t });
        if (variant512) {
            console.log("Found 512GB variant (ID 44). Moving to Product 248...");
            variant512.product_id = 248;
            variant512.storage = '512GB'; // Normalize storage name
            // Fix price if null (using the price from Product 251 or a default)
            if (!variant512.sale_price) {
                variant512.sale_price = 34706000; // From Product 251 data
            }
            await variant512.save({ transaction: t });
        }

        // 4. Rename Product 248 to be generic
        console.log("Renaming main product...");
        mainProduct.name = "iPhone 16 Pro Max";
        // Keep slug '16prm' or change it? '16prm' is fine.
        await mainProduct.save({ transaction: t });

        // 5. Delete the duplicate Product 251
        console.log("Deleting duplicate product 251...");
        await Product.destroy({ where: { id: 251 }, transaction: t });

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
