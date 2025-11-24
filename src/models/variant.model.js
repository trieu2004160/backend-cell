const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database.config");

const ProductVariant = sequelize.define(
    "ProductVariant",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "products",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        sku: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        storage: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        color: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        attributes: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        cost_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        original_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        sale_price: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        price_adjustment: {
            type: DataTypes.DECIMAL(15, 2),
            allowNull: true,
        },
        stock_quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        reserved_quantity: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        weight: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
        },
        dimensions: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
        image_url: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        gallery: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        is_default: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        sales_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        views_count: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        barcode: {
            type: DataTypes.STRING(100),
            allowNull: true,
        },
    },
    {
        tableName: "product_variants",
        timestamps: true,
        underscored: true,
    }
);

module.exports = ProductVariant;
