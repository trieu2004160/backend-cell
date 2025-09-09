const express = require("express");
const app = express();

// Test để kiểm tra route
const adminProductImagesRoute = require("./src/routes/admin.product.images.routes.js");

app.use("/test-admin-images", adminProductImagesRoute);

app.listen(3001, () => {
  console.log("Test server running on port 3001");
  console.log("Try: http://localhost:3001/test-admin-images/product/12");
});
