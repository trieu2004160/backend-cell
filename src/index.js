require("dotenv").config();
require("./configs/database.config");
const express = require("express");
const path = require("path");
const app = express();
const PORT = process.env.PORT || 3001;
const allRoute = require("./routes/index");
const cors = require("cors");

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:3001",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Serve static files for uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`\n=== ${req.method} REQUEST RECEIVED ===`);
  console.log('URL:', req.url);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log parsed body
app.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PATCH' || req.method === 'PUT') {
    console.log('Parsed Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});




console.log("Mounting routes to /api...");
app.use("/api", allRoute);
console.log("Routes mounted successfully!");

// Add simple test endpoints
app.get("/test", (req, res) => {
  res.json({
    message: "Server is working!",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Add debug middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - Route not found`);
  next();
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

// Error handling middleware - phải đặt SAU tất cả routes
app.use((err, req, res, next) => {
  console.error('❌ Error occurred:');
  console.error('Error name:', err.name);
  console.error('Error message:', err.message);
  console.error('Error stack:', err.stack);

  // Multer errors
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        status: 'error',
        message: 'File quá lớn! Giới hạn 5MB'
      });
    }
    return res.status(400).json({
      status: 'error',
      message: err.message
    });
  }

  // Other errors
  res.status(500).json({
    status: 'error',
    message: err.message || 'Lỗi server không xác định'
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running port ${PORT}`);
  console.log(`API available at: http://localhost:${PORT}/api/products`);
});
