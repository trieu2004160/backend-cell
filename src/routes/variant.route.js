const express = require("express");
const router = express.Router();
const {
  createVariantController,
  getVariantsByProductIdController,
  getVariantByIdController,
  updateVariantController,
  deleteVariantController,
  setDefaultVariantController,
} = require("../controllers/variant.controller");

// Debug middleware
router.use((req, res, next) => {
  console.log("=== VARIANT ROUTE ===");
  console.log("Method:", req.method);
  console.log("URL:", req.url);
  console.log("Body:", req.body);
  next();
});

// Create variant for a product
router.post("/products/:productId/variants", createVariantController);

// Get all variants for a product
router.get("/products/:productId/variants", getVariantsByProductIdController);

// Get single variant
router.get("/variants/:id", getVariantByIdController);

// Update variant
router.patch("/variants/:id", updateVariantController);

// Delete variant
router.delete("/variants/:id", deleteVariantController);

// Set default variant
router.post("/variants/:id/set-default", setDefaultVariantController);

module.exports = router;
