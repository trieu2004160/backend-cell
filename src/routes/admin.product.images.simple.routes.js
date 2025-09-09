const express = require("express");
const router = express.Router();

console.log("Simple admin product images route loaded");

// Simple test route
router.get("/test", (req, res) => {
  res.json({
    status: "success",
    message: "Admin product images route is working!",
    timestamp: new Date().toISOString(),
  });
});

// Simple route to get product images
router.get("/product/:productId", async (req, res) => {
  const { productId } = req.params;

  res.json({
    status: "success",
    message: `Getting images for product ${productId}`,
    data: [],
    note: "This is a test response - real database integration coming soon",
  });
});

module.exports = router;
