require("dotenv").config();
require("./src/configs/database.config");
const express = require("express");
const app = express();
const cors = require("cors");

// Enable CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test route để verify server hoạt động
app.get("/test", (req, res) => {
  res.json({ message: "Test server works!" });
});

// Directly test admin product images route
const adminProductImagesRoute = require("./src/routes/admin.product.images.routes");
app.use("/api/admin/product-images", adminProductImagesRoute);

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
  console.log(
    `Try: http://localhost:${PORT}/api/admin/product-images/product/12`
  );
});
