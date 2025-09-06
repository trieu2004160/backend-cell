// Test variants API endpoint
require("dotenv").config();
const express = require("express");
const { Sequelize, QueryTypes } = require("sequelize");

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

// Get variants for a product
app.get("/api/variants/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const variants = await sequelize.query(
      `
      SELECT 
        id, storage, color, image_url, price_adjustment as price, 
        stock_quantity, is_active
      FROM product_variants 
      WHERE product_id = $1 AND is_active = true
      ORDER BY id
    `,
      {
        bind: [productId],
        type: QueryTypes.SELECT,
      }
    );

    res.json({
      status: "success",
      message: `Found ${variants.length} variants`,
      data: variants,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Variants API running on http://localhost:${PORT}`);
});
