const { Sequelize, DataTypes, Op } = require('sequelize');
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
}, { tableName: 'product_variants', timestamps: true, underscored: true });

Product.hasMany(ProductVariant, { foreignKey: 'product_id', as: 'variants' });
ProductVariant.belongsTo(Product, { foreignKey: 'product_id' });

async function checkProducts() {
    try {
        const products = await Product.findAll({
            where: {
                name: {
                    [Op.iLike]: '%iphone 16 pro max%'
                }
            },
            include: [{
                model: ProductVariant,
                as: 'variants'
            }]
        });

        const fs = require('fs');
        fs.writeFileSync('iphone16_data.json', JSON.stringify(products, null, 2));
        console.log('Data written to iphone16_data.json');
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await sequelize.close();
    }
}

checkProducts();
