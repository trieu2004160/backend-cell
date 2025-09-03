const { QueryTypes } = require("sequelize");
const sequelize = require("../configs/database.config");
const Product = require("../models/product.model");

const createProductRepository = async (payload) => {
  return await Product.create(payload);
};

const checkNameExist = async (name) => {
  return await Product.findOne({ where: { name } });
};

const checkSlugExist = async (slug) => {
  return await Product.findOne({ where: { slug } });
};

const checkSkuExist = async (sku) => {
  return await Product.findOne({ where: { sku } });
};

const getAllProductReposiroty = async (options = {}) => {
  const {
    page = 1,
    limit = 50,
    search,
    category_id,
    brand_id,
    all = false,
  } = options;

  // Build WHERE conditions
  let whereConditions = [];
  let params = [];
  let paramCount = 0;

  if (search) {
    paramCount++;
    whereConditions.push(
      `(p.name ILIKE $${paramCount} OR p.full_description ILIKE $${paramCount})`
    );
    params.push(`%${search}%`);
  }

  if (category_id) {
    paramCount++;
    whereConditions.push(`p.category_id = $${paramCount}`);
    params.push(category_id);
  }

  if (brand_id) {
    paramCount++;
    whereConditions.push(`p.brand_id = $${paramCount}`);
    params.push(brand_id);
  }

  const whereClause =
    whereConditions.length > 0 ? `WHERE ${whereConditions.join(" AND ")}` : "";

  // Nếu all=true, lấy tất cả sản phẩm không phân trang
  if (all) {
    const dataQuery = `
      SELECT 
        p.*, 
        c.name as category_name, 
        b.name as brand_name, 
        ARRAY_AGG(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) AS product_image
      FROM products p
      JOIN categories c on c.id = p.category_id
      JOIN brands b on b.id = p.brand_id
      LEFT JOIN product_images pi ON pi.product_id = p.id
      ${whereClause}
      GROUP BY p.id, c.name, b.name
      ORDER BY p.id
    `;

    const data = await sequelize.query(dataQuery, {
      bind: params,
      type: QueryTypes.SELECT,
    });

    return {
      data,
      total: data.length,
      all: true,
    };
  }

  // Pagination logic (mặc định)
  const offset = (page - 1) * limit;

  // Get total count
  const countQuery = `
    SELECT COUNT(DISTINCT p.id) as total
    FROM products p
    JOIN categories c on c.id = p.category_id
    JOIN brands b on b.id = p.brand_id
    ${whereClause}
  `;

  const countResult = await sequelize.query(countQuery, {
    bind: params,
    type: QueryTypes.SELECT,
  });

  const total = parseInt(countResult[0].total);
  const totalPages = Math.ceil(total / limit);

  // Get paginated data
  const dataQuery = `
    SELECT 
      p.*, 
      c.name as category_name, 
      b.name as brand_name, 
      ARRAY_AGG(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) AS product_image
    FROM products p
    JOIN categories c on c.id = p.category_id
    JOIN brands b on b.id = p.brand_id
    LEFT JOIN product_images pi ON pi.product_id = p.id
    ${whereClause}
    GROUP BY p.id, c.name, b.name
    ORDER BY p.id
    LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
  `;

  params.push(limit, offset);

  const data = await sequelize.query(dataQuery, {
    bind: params,
    type: QueryTypes.SELECT,
  });

  return {
    data,
    pagination: {
      current_page: page,
      per_page: limit,
      total,
      total_pages: totalPages,
      has_next_page: page < totalPages,
      has_prev_page: page > 1,
    },
  };
};

const deleteProductRepository = async (id) => {
  return await Product.destroy({ where: { id } });
};

const updateProductRepository = async (id, payload) => {
  const product = await Product.findByPk(id);
  if (!product) return null;
  Object.assign(product, payload);
  await product.save();
};

const getAllNameProductRepository = async () => {
  return await Product.findAll({
    attributes: ["id", "name"],
    raw: true,
  });
};

const getProductFeatured = async (idCategory) => {
  return await sequelize.query(
    `
      SELECT p.name
      FROM products p
      WHERE p.is_featured = true AND p.category_id = :idCategory
    `,
    {
      type: QueryTypes.SELECT,
      replacements: { idCategory },
    }
  );
};

module.exports = {
  createProductRepository,
  checkNameExist,
  checkSkuExist,
  checkSlugExist,
  getAllProductReposiroty,
  deleteProductRepository,
  updateProductRepository,
  getAllNameProductRepository,
  getProductFeatured,
};
