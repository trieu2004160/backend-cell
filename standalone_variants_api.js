const express = require("express");
const { Sequelize, QueryTypes } = require("sequelize");
require("dotenv").config();

const app = express();
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    logging: false,
  }
);

app.use(express.json());

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Test route
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Product Variants API is running",
    endpoints: [
      "GET /api/product-variants/capacity/:group_name",
      "GET /api/product-variants/capacity/:capacity/group/:group_name",
      "GET /api/product-variants/:id",
      "GET /api/product-variants/product/:productId",
    ],
  });
});

// API Routes
const baseRoute = "/api/product-variants";

// Lấy danh sách capacity cho một group_name
app.get(`${baseRoute}/capacity/:group_name`, async (req, res) => {
  try {
    const { group_name } = req.params;
    console.log("Getting capacities for:", group_name);

    const capacities = await sequelize.query(
      `
      SELECT DISTINCT storage as capacity
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      WHERE p.name LIKE '%${group_name}%' 
      AND pv.is_active = true
      ORDER BY capacity
    `,
      {
        type: QueryTypes.SELECT,
      }
    );

    res.json({
      status: "success",
      message: `Found ${capacities.length} capacities for ${group_name}`,
      data: capacities,
    });
  } catch (error) {
    console.error("Error getting capacities:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Lấy danh sách variant theo capacity và group_name
app.get(
  `${baseRoute}/capacity/:capacity/group/:group_name`,
  async (req, res) => {
    try {
      const { capacity, group_name } = req.params;
      console.log("Getting variants for:", capacity, group_name);

      const variants = await sequelize.query(
        `
      SELECT 
        pv.id,
        pv.color as variant_name,
        pv.storage as capacity,
        pv.sale_price as price,
        pv.image_url,
        pv.stock_quantity
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      WHERE p.name LIKE '%${group_name}%' 
      AND pv.storage = :capacity
      AND pv.is_active = true
      ORDER BY pv.id
    `,
        {
          replacements: { capacity },
          type: QueryTypes.SELECT,
        }
      );

      res.json({
        status: "success",
        message: `Found ${variants.length} variants for ${capacity} ${group_name}`,
        data: variants,
      });
    } catch (error) {
      console.error("Error getting variants:", error);
      res.status(500).json({
        status: "error",
        message: error.message,
      });
    }
  }
);

// Lấy variant theo ID
app.get(`${baseRoute}/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Getting variant by ID:", id);

    const variant = await sequelize.query(
      `
      SELECT 
        pv.id,
        pv.color as variant_name,
        pv.storage as capacity,
        pv.sale_price as price,
        pv.image_url,
        pv.stock_quantity,
        p.name as product_name
      FROM product_variants pv
      JOIN products p ON pv.product_id = p.id
      WHERE pv.id = :id
      AND pv.is_active = true
    `,
      {
        replacements: { id },
        type: QueryTypes.SELECT,
      }
    );

    if (variant.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Variant not found",
      });
    }

    res.json({
      status: "success",
      message: "Variant found",
      data: variant[0],
    });
  } catch (error) {
    console.error("Error getting variant by ID:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

// Lấy tất cả variants cho một sản phẩm
app.get(`${baseRoute}/product/:productId`, async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("Getting variants for product:", productId);

    const variants = await sequelize.query(
      `
      SELECT 
        pv.id,
        pv.color as variant_name,
        pv.storage as capacity,
        pv.sale_price as price,
        pv.image_url,
        pv.stock_quantity
      FROM product_variants pv
      WHERE pv.product_id = :productId
      AND pv.is_active = true
      ORDER BY pv.storage, pv.id
    `,
      {
        replacements: { productId },
        type: QueryTypes.SELECT,
      }
    );

    res.json({
      status: "success",
      message: `Found ${variants.length} variants`,
      data: variants,
    });
  } catch (error) {
    console.error("Error getting variants by product ID:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

const PORT = 3001;
app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log(`🚀 Product Variants API running on http://localhost:${PORT}`);
    console.log("📦 Database connected successfully!");
    console.log("\n🔗 Available endpoints:");
    console.log(
      `   GET http://localhost:${PORT}${baseRoute}/capacity/iPhone%2015%20Pro%20Max`
    );
    console.log(
      `   GET http://localhost:${PORT}${baseRoute}/capacity/256GB/group/iPhone%2015%20Pro%20Max`
    );
    console.log(`   GET http://localhost:${PORT}${baseRoute}/product/12`);
    console.log(`   GET http://localhost:${PORT}${baseRoute}/16`);
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
});
