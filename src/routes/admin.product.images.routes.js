const express = require("express");
const router = express.Router();
const db = require("../configs/database.config");

console.log("Admin product images routes loaded");

// Debug middleware
router.use((req, res, next) => {
  console.log(`Admin product images route: ${req.method} ${req.path}`);
  next();
});

// Lấy tất cả ảnh sản phẩm
router.get("/", async (req, res) => {
  console.log("GET / route hit");
  try {
    const { productId, imageType } = req.query;

    let query = `
      SELECT 
        pi.*,
        p.name as product_name
      FROM product_images pi
      LEFT JOIN products p ON pi.product_id = p.id
      WHERE 1=1
    `;

    const queryParams = [];
    let paramIndex = 1;

    if (productId) {
      query += ` AND pi.product_id = $${paramIndex}`;
      queryParams.push(productId);
      paramIndex++;
    }

    if (imageType) {
      query += ` AND pi.image_type = $${paramIndex}`;
      queryParams.push(imageType);
      paramIndex++;
    }

    query += ` ORDER BY pi.sort_order ASC, pi.id DESC`;

    const result = await db.query(query, queryParams);

    res.json({
      status: "success",
      message: "Lấy danh sách ảnh thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching product images:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi lấy danh sách ảnh",
    });
  }
});

// Lấy ảnh sản phẩm theo product ID
router.get("/product/:productId", async (req, res) => {
  console.log(
    "GET /product/:productId route hit, productId:",
    req.params.productId
  );
  try {
    const { productId } = req.params;

    const query = `
      SELECT 
        pi.*,
        p.name as product_name
      FROM product_images pi
      LEFT JOIN products p ON pi.product_id = p.id
      WHERE pi.product_id = $1
      ORDER BY pi.sort_order ASC, pi.created_at DESC
    `;

    const result = await db.query(query, [productId]);

    res.json({
      status: "success",
      message: `Lấy ảnh sản phẩm ${productId} thành công`,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching product images:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi lấy ảnh sản phẩm",
    });
  }
});

// Tạo ảnh sản phẩm mới
router.post("/", async (req, res) => {
  try {
    console.log("=== CREATE PRODUCT IMAGE REQUEST ===");
    console.log("Request body:", req.body);

    const {
      product_id,
      image_type,
      image_url,
      alt_text,
      sort_order,
      variant_capacity,
      variant_color,
      is_active,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!product_id || !image_type) {
      console.log("Validation failed: missing required fields");
      return res.status(400).json({
        status: "error",
        message: "Thiếu thông tin bắt buộc (product_id, image_type)",
      });
    }

    const query = `
      INSERT INTO product_images 
      (product_id, image_type, image_url, alt_text, sort_order, variant_capacity, variant_color, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      product_id,
      image_type,
      image_url || '', // Default to empty string if not provided
      alt_text || '', // Default to empty string if not provided
      parseInt(sort_order) || 1,
      variant_capacity || null,
      variant_color || null,
      is_active !== undefined ? is_active : true,
    ];

    console.log("Query values:", values);

    const result = await db.query(query, values);

    console.log("Insert result:", result.rows);

    res.status(201).json({
      status: "success",
      message: "Thêm ảnh sản phẩm thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating product image:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi tạo ảnh sản phẩm",
      error: error.message, // Add error details for debugging
    });
  }
});

// Cập nhật ảnh sản phẩm
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_id,
      image_type,
      image_url,
      alt_text,
      sort_order,
      variant_capacity,
      variant_color,
      is_active,
    } = req.body;

    const query = `
      UPDATE product_images 
      SET 
        product_id = $1,
        image_type = $2,
        image_url = $3,
        alt_text = $4,
        sort_order = $5,
        variant_capacity = $6,
        variant_color = $7,
        is_active = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      product_id,
      image_type,
      image_url,
      alt_text,
      parseInt(sort_order) || 1,
      variant_capacity || null,
      variant_color || null,
      is_active !== undefined ? is_active : true,
      id,
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy ảnh sản phẩm",
      });
    }

    res.json({
      status: "success",
      message: "Cập nhật ảnh sản phẩm thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating product image:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi cập nhật ảnh sản phẩm",
    });
  }
});

// Xóa ảnh sản phẩm
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM product_images WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy ảnh sản phẩm",
      });
    }

    res.json({
      status: "success",
      message: "Xóa ảnh sản phẩm thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting product image:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi xóa ảnh sản phẩm",
    });
  }
});

// Lấy ảnh theo sản phẩm và variant
router.get("/product/:productId/variant", async (req, res) => {
  try {
    const { productId } = req.params;
    const { capacity, color } = req.query;

    let query = `
      SELECT * FROM product_images 
      WHERE product_id = $1 AND image_type = 'variant' AND is_active = true
    `;

    const queryParams = [productId];
    let paramIndex = 2;

    if (capacity) {
      query += ` AND variant_capacity = $${paramIndex}`;
      queryParams.push(capacity);
      paramIndex++;
    }

    if (color) {
      query += ` AND variant_color ILIKE $${paramIndex}`;
      queryParams.push(`%${color}%`);
      paramIndex++;
    }

    query += ` ORDER BY sort_order ASC`;

    const result = await db.query(query, queryParams);

    res.json({
      status: "success",
      message: "Lọc ảnh sản phẩm thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching variant images:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi lấy ảnh variant",
    });
  }
});

// Cập nhật thứ tự ảnh
router.patch("/reorder", async (req, res) => {
  try {
    const { imageOrders } = req.body; // Array of {id, sortOrder}

    if (!imageOrders || !Array.isArray(imageOrders)) {
      return res.status(400).json({
        status: "error",
        message: "Dữ liệu thứ tự không hợp lệ",
      });
    }

    // Update multiple records
    for (const order of imageOrders) {
      await db.query(
        "UPDATE product_images SET sort_order = $1, updated_at = NOW() WHERE id = $2",
        [order.sortOrder, order.id]
      );
    }

    res.json({
      status: "success",
      message: "Cập nhật thứ tự ảnh thành công",
    });
  } catch (error) {
    console.error("Error reordering images:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi cập nhật thứ tự ảnh",
    });
  }
});

module.exports = router;
