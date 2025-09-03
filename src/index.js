require("dotenv").config();
require("./configs/database.config");
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3001;
const allRoute = require("./routes/index");
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", allRoute);

// Add simple test endpoints
app.get("/test", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

app.get("/api/test-products", async (req, res) => {
  try {
    const sequelize = require("./configs/database.config");
    const products = await sequelize.query(
      "SELECT id, name, price FROM products LIMIT 3",
      { type: sequelize.QueryTypes.SELECT }
    );
    res.json({
      status: "success",
      message: "Direct database test",
      data: products,
      total: products.length,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api/products`);
});
