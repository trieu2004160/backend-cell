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

const getProductByIdRepository = async (id) => {
  console.log("=== NEW VERSION: GETTING PRODUCT BY ID/SLUG:", id, "===");

  // Check if id is a number or slug
  const isNumeric = !isNaN(id);
  const whereClause = isNumeric ? "WHERE p.id = $1" : "WHERE p.slug = $1";

  const query = `
    SELECT 
      p.*,
      p.sale_price as price,
      c.name as category_name,
      b.name as brand_name,
      COALESCE(
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', pi.id,
              'image_url', pi.image_url,
              'sort_order', pi.sort_order
            )
            ORDER BY pi.sort_order
          )
          FROM product_images pi 
          WHERE pi.product_id = p.id
        ), 
        '[]'::json
      ) as images,
      COALESCE(
        (
          SELECT JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', pv.id,
              'storage', pv.storage,
              'color', pv.color,
              'image_url', pv.image_url,
              'price', pv.sale_price,
              'stock_quantity', pv.stock_quantity,
              'is_active', pv.is_active
            )
            ORDER BY pv.storage, pv.color
          )
          FROM product_variants pv 
          WHERE pv.product_id = p.id AND pv.is_active = true
        ), 
        '[]'::json
      ) as variants
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    ${whereClause}
  `;

  const result = await sequelize
    .query(query, {
      bind: [id],
      type: QueryTypes.SELECT,
    })
    .catch((err) => {
      console.error("Database query error:", err);
      throw err;
    });

  console.log("Product query result:", JSON.stringify(result[0], null, 2));
  return result[0] || null;
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
  getProductByIdRepository,
};
