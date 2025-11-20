const express = require("express");
const router = express.Router();
const productVariantController = require("../controllers/product_variant.controller");

// GET /api/product-variants/many-id?ids=1,2,3
// Lấy nhiều variants theo danh sách IDs
router.get("/many-id", productVariantController.getVariantsByIds);

// GET /api/product-variants/capacity/:group_name
// Lấy danh sách capacity cho một group_name
router.get(
  "/capacity/:group_name",
  productVariantController.getCapacityByGroup
);

// GET /api/product-variants/capacity/:capacity/group/:group_name
// Lấy danh sách variant theo capacity và group_name
router.get(
  "/capacity/:capacity/group/:group_name",
  productVariantController.getVariantsByCapacityAndGroup
);

// GET /api/product-variants/:id
// Lấy variant theo ID
router.get("/:id", productVariantController.getVariantById);

// GET /api/product-variants/product/:productId
// Lấy tất cả variants cho một sản phẩm
router.get(
  "/product/:productId",
  productVariantController.getVariantsByProductId
);

module.exports = router;
