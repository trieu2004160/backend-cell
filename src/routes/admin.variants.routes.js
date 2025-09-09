const express = require("express");
const router = express.Router();
const db = require("../configs/database.config");

// Lấy tất cả variants với thông tin sản phẩm
router.get("/", async (req, res) => {
  try {
    const query = `
      SELECT 
        pv.*,
        p.name as product_name
      FROM product_variants pv
      LEFT JOIN products p ON pv.product_id = p.id
      ORDER BY pv.id DESC
    `;

    const result = await db.query(query);

    res.json({
      status: "success",
      message: "Lấy danh sách variants thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching variants:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi lấy danh sách variants",
    });
  }
});

// Tạo variant mới
router.post("/", async (req, res) => {
  try {
    const {
      product_id,
      capacity,
      color,
      price,
      discount_price,
      image_url,
      stock_quantity,
      is_active,
    } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!product_id || !capacity || !color || !price || !image_url) {
      return res.status(400).json({
        status: "error",
        message: "Thiếu thông tin bắt buộc",
      });
    }

    const query = `
      INSERT INTO product_variants 
      (product_id, capacity, color, price, discount_price, image_url, stock_quantity, is_active, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      product_id,
      capacity,
      color,
      parseInt(price),
      discount_price ? parseInt(discount_price) : null,
      image_url,
      parseInt(stock_quantity) || 0,
      is_active !== undefined ? is_active : true,
    ];

    const result = await db.query(query, values);

    res.status(201).json({
      status: "success",
      message: "Tạo variant thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating variant:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi tạo variant",
    });
  }
});

// Cập nhật variant
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const {
      product_id,
      capacity,
      color,
      price,
      discount_price,
      image_url,
      stock_quantity,
      is_active,
    } = req.body;

    const query = `
      UPDATE product_variants 
      SET 
        product_id = $1,
        capacity = $2,
        color = $3,
        price = $4,
        discount_price = $5,
        image_url = $6,
        stock_quantity = $7,
        is_active = $8,
        updated_at = NOW()
      WHERE id = $9
      RETURNING *
    `;

    const values = [
      product_id,
      capacity,
      color,
      parseInt(price),
      discount_price ? parseInt(discount_price) : null,
      image_url,
      parseInt(stock_quantity) || 0,
      is_active !== undefined ? is_active : true,
      id,
    ];

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy variant",
      });
    }

    res.json({
      status: "success",
      message: "Cập nhật variant thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating variant:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi cập nhật variant",
    });
  }
});

// Xóa variant
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const query = "DELETE FROM product_variants WHERE id = $1 RETURNING *";
    const result = await db.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Không tìm thấy variant",
      });
    }

    res.json({
      status: "success",
      message: "Xóa variant thành công",
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting variant:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi xóa variant",
    });
  }
});

// Lấy variants theo sản phẩm
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const query = `
      SELECT * FROM product_variants 
      WHERE product_id = $1 AND is_active = true
      ORDER BY capacity, color
    `;

    const result = await db.query(query, [productId]);

    res.json({
      status: "success",
      message: "Lấy variants theo sản phẩm thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching variants by product:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi lấy variants theo sản phẩm",
    });
  }
});

// Lấy capacities theo sản phẩm
router.get("/product/:productId/capacities", async (req, res) => {
  try {
    const { productId } = req.params;

    const query = `
      SELECT DISTINCT capacity 
      FROM product_variants 
      WHERE product_id = $1 AND is_active = true
      ORDER BY capacity
    `;

    const result = await db.query(query, [productId]);

    res.json({
      status: "success",
      message: "Lấy capacities thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching capacities:", error);
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi lấy capacities",
    });
  }
});

// Lấy variants theo capacity và tên sản phẩm
router.get("/capacity/:capacity/product/:productName", async (req, res) => {
  try {
    const { capacity, productName } = req.params;

    const query = `
      SELECT pv.* 
      FROM product_variants pv
      LEFT JOIN products p ON pv.product_id = p.id
      WHERE pv.capacity = $1 AND p.name ILIKE $2 AND pv.is_active = true
      ORDER BY pv.color
    `;

    const result = await db.query(query, [capacity, `%${productName}%`]);

    res.json({
      status: "success",
      message: "Lấy variants theo capacity và tên sản phẩm thành công",
      data: result.rows,
    });
  } catch (error) {
    console.error(
      "Error fetching variants by capacity and product name:",
      error
    );
    res.status(500).json({
      status: "error",
      message: "Lỗi server khi lấy variants",
    });
  }
});

module.exports = router;
