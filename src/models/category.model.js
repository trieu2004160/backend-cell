const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database.config");
const { default: slugify } = require("slugify");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    parent_id: {
      type: DataTypes.BIGINT,
    },
    image_url: {
      type: DataTypes.TEXT,
    },
    sort_order: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    tableName: "categories",
    timestamps: true,
    underscored: true,
  }
);

Category.beforeCreate((category) => {
  if (!category.slug && category.name) {
    category.slug = slugify(category.name, {
      lower: true,
      strict: true,
      locale: "vi",
    });
  }
});

Category.beforeUpdate((category) => {
  if (category.changed("name")) {
    category.slug = slugify(category.name, {
      lower: true,
      strict: true,
      locale: "vi",
    });
  }
});

module.exports = Category;
