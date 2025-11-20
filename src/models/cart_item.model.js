const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database.config");

const CartItem = sequelize.define(
  "CartItem",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    product_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: "products",
        key: "id",
      },
    },
    variant_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
  },
  {
    tableName: "cart_items",
    timestamps: true,
    underscored: true,
  }
);

module.exports = CartItem;
